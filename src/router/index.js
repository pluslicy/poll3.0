import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Base from '@/pages/base/Index'
import School from '@/pages/base/School'
import Grade from '@/pages/base/Grade'
import Clazz from '@/pages/base/Clazz'
import Course from '@/pages/base/Course'
import User from '@/pages/base/User'

import Qn from '@/pages/qn/Index'
import Question from '@/pages/qn/question'
import Questionnaire from '@/pages/qn/questionNaire'

import Survey from '@/pages/survey/Index'
import SurveyInfo from '@/pages/survey/SurveyInfo'
import SurveyMonitor from '@/pages/survey/SurveyMonitor'
import SurveyCheck from '@/pages/survey/SurveyCheck'

import Statistics from '@/pages/statistics/Index'
import SurveyList from '@/pages/statistics/SurveyList'
import SurveyClazz from '@/pages/statistics/SurveyClazz'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: HelloWorld
    },{
      path: '/statistics',
      component: Statistics,
      children:[{
        path: 'surveyList',
        component: SurveyList,
      },{
        path: 'surveyClazz',
        component: SurveyList,
      }]
    },{
      path: '/survey',
      component: Survey,
      children:[{
        path: 'surveyInfo',
        component: SurveyInfo,
      },{
        path: 'surveyMonitor',
        component: SurveyMonitor,
      },{
        path: 'surveyCheck',
        component: SurveyCheck,
      }]
    },{
      path: '/qn',
      component: Qn,
      children:[{
        path: 'question',
        component: Question,
      },{
        path: 'questionnaire',
        component: Questionnaire,
      }]
    },{
      path: '/base',
      component: Base,
      children:[{
      	path: 'school',
      	component: School,
      },{
      	path: 'grade',
      	component: Grade,
      },{
      	path: 'clazz',
      	component: Clazz,
      },{
      	path: 'course',
      	component: Course,
      },{
      	path: 'user',
      	component: User,
      }]
    }

  ]
})
