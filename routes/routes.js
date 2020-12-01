
import Router from 'koa-router'
import bodyParser from 'koa-body'

import publicRouter from './public.js'
import mymusicRouter from'./mymusic.js'

const mainRouter = new Router()
mainRouter.use(bodyParser({multipart: true}))

const nestedRoutes = [publicRouter, mymusicRouter]
for (const router of nestedRoutes) {
	mainRouter.use(router.routes())
	mainRouter.use(router.allowedMethods())
}

export default mainRouter
