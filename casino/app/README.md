# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Project Configuration

To recreate this project with the same configuration:

```sh
# recreate this project
pnpm dlx sv@0.15.1 create --template minimal --types ts --add tailwindcss="plugins:typography,forms" drizzle="database:sqlite+sqlite:libsql" better-auth="demo:password" --install pnpm app
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
