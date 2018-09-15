import Vue from 'vue';
import Router from 'vue-router';

import Main from '@/components/main.vue';
import Home from '@/components/home.vue';
import Bible from '@/components/bible.vue';
import BibleIndex from '@/components/bible/index.vue';
import BibleReader from '@/components/bible/reader.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      redirect: { name: 'home' },
      component: Main,
      children: [{
        path: '/home',
        name: 'home',
        component: Home,
      }],
    },
    {
      path: '/bible',
      name: 'bible',
      component: Bible,
      redirect: { name: 'bibleIndex' },
      children: [{
        path: '/bible/versions/:version',
        name: 'bibleIndex',
        component: BibleIndex,
      },
      {
        path: '/bible/versions/:version/books/:book/chapters/:chapter',
        name: 'reader',
        component: BibleReader,
      }],
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
