import Vue from 'vue';
import VueI18n from 'vue-i18n';

const data = require('../message.json');

Vue.use(VueI18n);

export default new VueI18n({
  locale: navigator.language.split('-')[0],
  fallbackLocale: 'en',
  messages: data
});
