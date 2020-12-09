
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

router.get('/details/:id', async ctx => {
	const tracks = await new Tracks(dbName)
	try {
		console.log(`record: ${ctx.params.id}`)
		ctx.hbs.track = await tracks.getByID(ctx.params.id)
		console.log(ctx.hbs)
		ctx.hbs.id = ctx.params.id
		await ctx.render('details', ctx.hbs)
	} catch(err) {
		console.log(err)
		await ctx.render('error',ctx.hbs)
	}
})

router.get('/add', async ctx => {
	await ctx.render('add', ctx.hbs)
})

router.post('/add', async ctx => {
	const tracks = await new Tracks(dbName)
	try {
		ctx.request.body.account = ctx.session.userid
		if(ctx.request.files.audiofile.name) {
			ctx.request.body.filePath = ctx.request.files.audiofile.path
			ctx.request.body.fileName = ctx.request.files.audiofile.name
			ctx.request.body.fileType = ctx.request.files.audiofile.type
		}
		await tracks.add(ctx.request.body)
		return ctx.redirect('/mymusic?msg=new track added')
	} catch(err) {
		console.log(err)
		await ctx.render('error', ctx.hbs)
	} finally {
		tracks.close()
	}
})

export default router
