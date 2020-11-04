<!DOCTYPE html>

<head>
	<title>I'm gonna COOM</title>
	<link rel='icon' type='image/png' href='/favicon.png'>
	<link rel='stylesheet' href='/global.css'>
</head>

<body>
	<img class="coom" src="/cunny" />
	<h1>coom.tech</h1>
	<h3>learn how to just fucking coom</h3>
	<p>Links to resources, guides, and all required tech to make you just fucking coom.</p>
	<h2>Categories</h2>
	<div class="content">
		{{#categories}}
		<a href="./category/{{href}}">
			<span>{{title}}</span>
			<p>{{desc}}</p>
		</a>
		{{/categories}}
	</div>
	<h2>Suggestions</h2>
	<div class="content">
		<div>
			<p>Send me suggestions for new links/categories to add, or things to remove if they're outclassed by
				something/irrelevant</p>
			<p>I'll still add things from the thread on my own if I deem them interesting, but feel free to suggest
				things I may have missed/didn't consider interesting.</p>
			<p>You are also welcome to coomtribute on <a href="https://github.com/coomdev/coom.tech">GitHub®</a>.</p>
			<p>You can also upload repos on <a href="https://git.coom.tech/">our Gitea</a> (no mail verification is required)</p>
		</div>
		<form method="POST" action="/sugg">
			<textarea rows="20" cols="80" name="content" placeholder="Here's my great suggestion!"></textarea>
			<input type="submit" />
		</form>
		<div>
			<h2>API</h2>
			<h3>Endpoints descriptions</h3>
			<table>
				<thead>
					<tr>
						<th>Endpoint</th>
						<th>Method</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>/<i>:category</i>/index.json</th>
						<th>GET</th>
						<th>For any category in ["clients", "misc", "toys", "games", "manage"], returns the section content.</th>
					</tr>
					<tr>
						<th>/cunny</th>
						<th>GET</th>
						<th>Returns a random image from a specially curated selection of pictures.</th>					
					</tr>
					<tr>
						<th>/kani</th>
						<th>GET</th>
						<th>Returns a list of all available images from their filenames.</th>					
					</tr>
					<tr>
						<th>/kani/<i>:filename</i></th>
						<th>GET</th>
						<th>Returns the requested image.</th>					
					</tr>
					<tr>
						<th>/kani</th>
						<th>POST</th>
						<th>
							Upload a file (up to 8MBs) as a suggestion to get added to the collection.<br>
							You can easily upload a file from your CLI with CURL:<br>
							<pre>curl -F 'file=@[path]' https://coom.tech/kani</pre>
						</th>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</body>