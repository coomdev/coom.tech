<!DOCTYPE html>
<head>
    <title>I'm gonna COOM</title>
    <link rel='icon' type='image/png' href='/favicon.png'>
	<link rel='stylesheet' href='/global.css'>
</head>
<body>
  <img class="coom" src="/cunny"/>
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
			<p>Send me suggestions for new links/categories to add, or things to remove if they're outclassed by something/irrelevant</p>
			<p>I'll still add things from the thread on my own if I deem them interesting, but feel free to suggest things I may have missed/didn't consider interesting.</p>
			<form method="POST" action="/sugg">
				<textarea rows="20" cols="80" name="content" placeholder="Here's my great suggestion!"></textarea>
				<input type="submit"/>
			</form>
	</div>
</body>
