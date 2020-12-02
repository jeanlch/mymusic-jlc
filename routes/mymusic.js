
import Router from 'koa-router'

const router = new Router({ prefix: '/mymusic' })

import Tracks from '../modules/tracks.js'
const dbName = 'website.db'

async function checkAuth(ctx, next) {
	console.log('secure router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
	await next()
}

router.use(checkAuth)

/* pulling out the records*/

router.get('/', async ctx => {
  const tracks = await new Tracks(dbName)
	try {
    const records = await tracks.all()
    console.log(records)
    ctx.hbs.records = records
		await ctx.render('mymusic', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

router.get('/add', async ctx => {
 await ctx.render('add', ctx.hbs)   
})

router.post('/add', async ctx => {
    console.log("adding a new track")
    return ctx.redirect('/mymusic?msg=new track added')
})
export default router
