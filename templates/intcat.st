{{^group}}
	<a href="{{url}}">
		<span>{{name}}</span>
		<p>{{desc}}</p>
	</a>
{{/group}}
{{#group}}
<div class="subcat {{#cats}}{{.}}{{/cats}}">
	<h2>{{group}}</h2>
	{{#content}}
	<a href="{{url}}">
		<span>{{name}}</span>
		<p>{{desc}}</p>
	</a>
	{{/content}}
</div>
{{/group}}
