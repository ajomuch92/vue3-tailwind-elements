# Icons

`te-icon` renders class names, so it works with any icon font.

## Bootstrap Icons (default)

By default the component emits [Bootstrap Icons](https://icons.getbootstrap.com/)
class names (`bi bi-*`). Install the font to see them:

```bash
npm install bootstrap-icons
```

```css
@import "bootstrap-icons/font/bootstrap-icons.css";
```

```vue
<te-icon name="alarm" />
<te-icon name="bi-alarm" />   <!-- the bi- prefix is optional -->
```

## Social icons

Setting `social` renders an inline SVG instead, so these need no font at all:

<Demo>
  <te-icon social name="github" />
  <te-icon social name="twitter" />
  <te-icon social name="whatsapp" />
  <te-icon social name="telegram" />
  <te-icon social name="youtube" />
</Demo>

```vue
<te-icon social name="github" />
```

Available names: `behance`, `discord`, `facebook`, `messenger`, `twitter`,
`google`, `instagram`, `linkedin`, `pinterest`, `vkontakte`, `overflow`,
`telegram`, `youtube`, `tiktok`, `snapchat`, `slack`, `github`, `dribbble`,
`reddit`, `whatsapp`, `twitch`.

## Custom icon families

Register your own sets when installing the plugin, then select one with
`family`:

```ts
app.use(Vue3TailwindElements, {
  customIcons: {
    fa: {
      prefix: 'fa-',
      icons: { star: 'star', trash: 'trash-can' },
    },
  },
});
```

```vue
<te-icon family="fa" name="trash" />  <!-- renders class="fa-trash-can" -->
```

If a name is missing from the family, the raw name is used as the suffix. An
unknown family logs a warning and renders nothing.
