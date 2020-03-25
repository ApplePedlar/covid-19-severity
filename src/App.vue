<template lang="pug">
  .top
    h1 {{ $t("message.title") }}
    .about {{ $t("message.about") }}
    v-data-table(
      :headers="tableHeaders",
      :items="tableData",
      :items-per-page="100",
      :hide-default-footer="true",
      :sort-by="['numberOfDeathsPerWeekPerPop']",
      :sort-desc="[true]")
</template>

<script>

import axios from "axios"
import csvParse from "csv-parse"
import populations from "./populations.json"

export default {
  data () {
    return {
      tableHeaders: [
        { text: this.$t("message.country"), align: "start", value: "country", width: "125px" },
        { text: this.$t("message.population"), align: "start", value: "population" },
        { text: this.$t("message.totalNumberOfDeaths"), align: "start", value: "totalNumberOfDeaths" },
        { text: this.$t("message.numberOfDeathsPerWeek"), align: "start", value: "numberOfDeathsPerWeek" },
        { text: this.$t("message.totalNumberOfDeathsPerPop"), align: "start", value: "totalNumberOfDeathsPerPop" },
        { text: this.$t("message.numberOfDeathsPerWeekPerPop"), align: "start", value: "numberOfDeathsPerWeekPerPop" },
      ],
      tableData: [],
      populations: populations
    }
  },
  mounted () {
    axios
      .get('https://pomber.github.io/covid19/timeseries.json')
      .then(response => {
        let records = response.data
        let countries = Object.keys(records)
        for (let i = 0; i < countries.length; i++) {
          let country = countries[i]
          let totalNumberOfDeaths = records[country][records[country].length - 1].deaths
          let numberOfDeathsPerWeek = totalNumberOfDeaths - records[country][records[country].length - 8].deaths

          if (numberOfDeathsPerWeek >= 10) {
            let population = this.populations[country]
            if (!population) {
              continue
            }
            let totalNumberOfDeathsPerPop = Math.round(totalNumberOfDeaths / (population / 10000000) * 10) / 10
            let numberOfDeathsPerWeekPerPop = Math.round(numberOfDeathsPerWeek / (population / 10000000) * 10) / 10
            this.tableData.push({
              country: this.$t("country." + country) || country,
              population: population,
              totalNumberOfDeaths: totalNumberOfDeaths,
              numberOfDeathsPerWeek: numberOfDeathsPerWeek,
              totalNumberOfDeathsPerPop: totalNumberOfDeathsPerPop,
              numberOfDeathsPerWeekPerPop: numberOfDeathsPerWeekPerPop
            })
          }
        }
      })
  },
  methods: {
  }
}
</script>

<style lang="sass">

.top
  max-width: 800px
  margin: 30px auto
  .about
    margin: 20px
</style>
