<template lang="pug">
  .top
    h1 {{ $t("message.title") }}
    .about {{ $t("message.about") }}
    v-data-table.table(
      :headers="tableHeaders",
      :items="tableData",
      :items-per-page="100",
      :hide-default-footer="true",
      :sort-by="['numberOfDeathsPerWeekPerPop']",
      :sort-desc="[true]",
      :mobile-breakpoint="0")
    .last-update {{ $t("message.lastUpdate") }}: {{ lastUpdate }}
    .project-home {{ $t("message.projectHome") }}: 
      a(href="https://github.com/ApplePedlar/covid-19-severity" target="_new") GitHub ApplePedlar/covid-19-severity
    .data-source {{ $t("message.dataSource") }}: 
      a(href="https://github.com/pomber/covid19" target="_new") GitHub pomber/covid19
</template>

<script>

import axios from "axios"
import populations from "./populations.json"

export default {
  data () {
    return {
      sourceUrl: 'https://pomber.github.io/covid19/timeseries.json',
      tableHeaders: [
        { text: this.$t("message.country"), align: "start", value: "country", width: "100px" },
        { text: this.$t("message.totalNumberOfDeaths"), align: "start", value: "totalNumberOfDeaths" },
        { text: this.$t("message.numberOfDeathsPerWeek"), align: "start", value: "numberOfDeathsPerWeek" },
        { text: this.$t("message.totalNumberOfDeathsPerPop"), align: "start", value: "totalNumberOfDeathsPerPop" },
        { text: this.$t("message.numberOfDeathsPerWeekPerPop"), align: "start", value: "numberOfDeathsPerWeekPerPop" },
      ],
      tableData: [],
      populations: populations,
      lastUpdate: ""
    }
  },
  mounted () {
    axios
      .get(this.sourceUrl)
      .then(response => {
        let records = response.data
        let countries = Object.keys(records)
        this.lastUpdate = records["Japan"][records["Japan"].length - 1].date
        countries.forEach(country => {
          let totalNumberOfDeaths = records[country][records[country].length - 1].deaths
          let numberOfDeathsPerWeek = totalNumberOfDeaths - records[country][records[country].length - 8].deaths

          if (totalNumberOfDeaths > 0) {
            let population = this.populations[country]
            if (population) {
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
      })
  }
}
</script>

<style lang="sass">
.top
  max-width: 800px
  margin: 30px auto
  h1
    font-size: 24px
  .about
    margin: 20px
  .table
    margin-bottom: 20px
    border: 1px solid silver
  .project-home, .data-source, .last-update
    font-size: 12px
</style>
