import koa = require('koa');
import fs = require('fs');
import Static = require('koa-static');
import send = require('koa-send');
import Router = require('koa-router');
const router = new Router();
import bodyParser = require('koa-bodyparser');
import mustache = require('mustache');

router.post('/sugg', (ctx, next) => {
	fs.writeFileSync(`messages/${+new Date}.txt`, ctx.request.body.content);
	ctx.response.body = `
<!DOCTYPE html>
<head>
    <title>UwU</title>
	<meta http-equiv="refresh" content="2; url=/">
    <link rel='icon' type='image/png' href='/favicon.png'>
	<link rel='stylesheet' href='/global.css'>
</head>
<body>
  'k, thx. Redirecting to <a href="home/">home</a> in 2 secs...
</body>
`;
});



const obs = {
	home: 'templates/home.st',
	cat: 'templates/cat.st',
	intcat: 'templates/intcat.st'
};

const templates: { [k in keyof typeof obs]?: FileBackedValue<string> } = {};

type Entry = {
	url: string;
	name: string;
	desc: string;
}

type GroupEntry = {
	group: string;
	cats?: string[];
	content: (Entry | GroupEntry)[];
}

type AllEntries = GroupEntry | Entry;

interface TemplateData {
	category: string;
	content: AllEntries[];
}

class FileBackedValue<T> {
	value: T;
	constructor(path: string, transformer: (a: string) => T = (e) => JSON.parse(e)) {
		this.value = transformer(fs.readFileSync(path).toString());
		fs.watch(path, (e) => {
			if (e == 'change')
				this.value = transformer(fs.readFileSync(path).toString());
		})
	}

	get() {
		return this.value;
	}
}

for (let i in obs) {
	let n = i as (keyof typeof obs);
	let k = new FileBackedValue<string>(obs[n], e => e);
	templates[n] = k;
}

interface HomeData {
	categories: {
		title: string;
		href: string;
		desc: string;
	}[];
}

let homedata = new FileBackedValue<HomeData>('public/index.json');

let datacache: { [k in string]?: FileBackedValue<TemplateData> } = {};
for (let d of homedata.get().categories) {
	datacache[d.href.substr(2)] = new FileBackedValue<TemplateData>(`public/${d.href}/index.json`);
}

//let content = [];
let content = fs.readdirSync('kani');
router.get('/cunny', (ctx, next) => {
	let str = content[~~(Math.random() * content.length)];
	return send(ctx, str, { root: './kani' });
});

router.get('/kani', async (ctx, next) => {
	ctx.body = content;
});

router.get('/kani/:fn', async (ctx, next) => {
	let p = ctx.params['fn'];
	return send(ctx, p, { root: './kani' });
});

router.get('/category/:cat', async (ctx, next) => {
	let p = ctx.params['cat'];
	if (datacache[p]) {
		ctx.body = mustache.render(templates.cat!.get(),
			datacache[p]?.get(),
			{ intcat: templates.intcat?.get() || '' });
	}
	return next;
});

router.get('/', async (ctx, next) => {
	ctx.body = mustache.render(templates.home!.get(), homedata.get());
	return next;
});

let root = new koa();
root.proxy = true;

root.use(bodyParser())
	.use(router.routes())
	.use(router.allowedMethods());

root.use(Static('./public', {
	index: 'index.html',
	root: './public'
})).use((c) => send(c, 'index.html', { root: './public' }));
root.listen(1243, '127.0.0.1', () => console.log('Listening...'));
