import koa = require('koa');
import fs = require('fs');
import Static = require('koa-static');
import send = require('koa-send');
import Router = require('koa-router');
const router = new Router<koa.DefaultState, koa.DefaultContext>();
import bodyParser = require('koa-bodyparser');
import mustache = require('mustache');
import path = require('path');
import multer = require('@koa/multer');

const reporoot = path.normalize(__dirname + '/..');

const upload = multer({ limits: { fileSize: 8 * 1024 * 1024 } });

router.post('/sugg', (ctx, next) => {
	fs.writeFileSync(
		path.join(reporoot, 'messages', `${+new Date}.txt`), ctx.request.body.content);
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

const obs: ['home', 'cat', 'intcat'] = ['home', 'cat', 'intcat'];

const templates: { [k in typeof obs[number]]?: FileBackedValue<string> } = {};

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
	constructor(path: string,
		defaultval?: T,
		transformer: (a: string) => T = (e) => JSON.parse(e)
	) {
		this.value = transformer(fs.readFileSync(path).toString());
		fs.watch(path, (e) => {
			if (e == 'change') {
				try {
					this.value = transformer(fs.readFileSync(path).toString());
				} catch {
					this.value = defaultval!;
				}
			}
		})
	}

	get() {
		return this.value;
	}
}

for (let i of obs) {
	templates[i] = new FileBackedValue<string>(i, '', e => e);
}

interface HomeData {
	categories: {
		title: string;
		href: string;
		desc: string;
	}[];
}
const pblc = path.join(reporoot, 'public');


let homedata = new FileBackedValue<HomeData>(path.join(pblc, 'index.json'), { categories: [] });

let datacache: { [k in string]?: FileBackedValue<TemplateData> } = {};
for (let d of homedata.get().categories) {
	datacache[d.href.substr(2)] = new FileBackedValue<TemplateData>(path.join(pblc, d.href, 'index.json'), { category: '', content: [] });
}

//let content = [];
const kani = path.join(reporoot, 'kani');
const pkani = path.join(reporoot, 'pending_kani');
let content = fs.readdirSync(kani);

fs.watch('./kani', { recursive: false }, () => {
	content = fs.readdirSync(kani);
});

router.get('/cunny', (ctx, next) => {
	let str = content[~~(Math.random() * content.length)];
	return send(ctx, str, { root: kani });
});

router.get('/kani', async (ctx, next) => {
	ctx.body = content;
});

router.post('/kani', upload.single('file'), async (ctx, next) => {
	await fs.promises.writeFile(path.join(pkani, `${+new Date}${path.extname(ctx.file.originalname)}`), ctx.file.buffer)
	ctx.body = 'done';
});

router.get('/kani/:fn', async (ctx, next) => {
	let p = ctx.params['fn'];
	return send(ctx, p, { root: kani });
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

root.use(Static(pblc, {
	index: 'index.html',
	root: pblc
})).use((c) => send(c, 'index.html', { root: pblc }));
root.listen(1243, '127.0.0.1', () => console.log('Listening...'));
