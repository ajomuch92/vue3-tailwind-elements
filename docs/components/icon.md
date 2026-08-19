# Icon

`te-icon` renders icon-font class names, or inline SVG for the social set. See
the [icons guide](/guide/icons) for setup.

## Social icons

Inline SVG, no font required.

<Demo>
  <te-icon social name="github" />
  <te-icon social name="linkedin" />
  <te-icon social name="slack" />
  <te-icon social name="reddit" />
  <te-icon social name="twitch" />
</Demo>

```vue
<te-icon social name="github" />
<te-icon social name="linkedin" />
<te-icon social name="slack" />
<te-icon social name="reddit" />
<te-icon social name="twitch" />
```

```vue
<te-icon name="alarm" />              <!-- class="bi bi-alarm" -->
<te-icon family="fa" name="trash" />  <!-- class="fa-trash-can" -->
<te-icon social name="github" />      <!-- inline SVG -->
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | — (required) | Icon name. The `bi-` prefix is optional for Bootstrap Icons. |
| `social` | `boolean` | `false` | Renders one of the bundled inline SVGs. |
| `family` | `string` | `undefined` | A family registered through the plugin options. |
