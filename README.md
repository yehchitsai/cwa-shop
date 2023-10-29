<p align="center">
  <h1 align="center">
    <img width=25px height=25px src="./src/favicon.ico" alt="CWA SHOP ICON">
    &nbsp;CWA SHOP
  </h1>
  <a href="https://github.com/sky172839465/cwa-shop/actions">
    <img src="https://img.shields.io/github/package-json/v/sky172839465/cwa-shop/main?logo=github" />
  </a>
  <a href="https://github.com/sky172839465/cwa-shop/tags">
    <img src="https://img.shields.io/github/actions/workflow/status/sky172839465/cwa-shop/main.yml?event=push&style=flat&logo=githubactions" />
  </a>
</p>

<h2 id='environment'>environment</h2>

<table width="100%">
  <thead>
    <tr>
      <th>NodeJS</th>
    </tr>
  <tbody>
    <tr>
      <td>18.15.0</td>
    </tr>
  </tbody>
</table>

<h2 id='quick-start'>quick start</h2>

1. fork repo
1. clone repo from your account
   ```shell
   git clone https://github.com/YOUR_ACCOUNT/cwa-shop.git
   ```
1. open in vscode
   ```shell
   code ./cwa-shop
   ```
1. install dependencies
   ```shell
   npm i
   ```
1. start dev server
   ```shell
   npm run dev
   ```

<h2 id='development'>development</h2>

1. create change and commit to your remote branch
1. send pull-request
1. wait for status check success
   - check linter
1. merge pr
1. trigger `main` branch push ci
   - check linter
   - bump version
   - upload to github page

<h2 id='package-usage'>package usage</h2>

<table width="100%">
  <thead>
    <tr>
      <th>package</th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>tailwindcss</td>
      <td>style element in classname</td>
    </tr>
    <tr>
      <td>daisyui</td>
      <td>styled component with tailwindcss</td>
    </tr>
    <tr>
      <td>i18next</td>
      <td>i18n package</td>
    </tr>
    <tr>
      <td>react-router-dom</td>
      <td>single page application router</td>
    </tr>
    <tr>
      <td>recoil</td>
      <td>global react state management</td>
    </tr>
    <tr>
      <td>swr</td>
      <td>request status management</td>
    </tr>
  </tbody>
    <thead>
    <tr>
      <th>dev package</th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>husky</td>
      <td>git commit hook</td>
    </tr>
    <tr>
      <td>lint-staged</td>
      <td>git hook trigger when staged files</td>
    </tr>
    <tr>
      <td>vite</td>
      <td>modern frontend development toolkit</td>
    </tr>
  </tbody>
</table>

<h2 id='npm-script-usage'>npm script usage</h2>

<table width="100%">
  <thead>
    <tr>
      <th>script</th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>npm run dev</td>
      <td>localhost start dev server</td>
    </tr>
    <tr>
      <td>npm run dev:mock</td>
      <td>localhost start dev server and mock api by `vite-plugin-mock`</td>
    </tr>
    <tr>
      <td>npm run dev:mockapi</td>
      <td>
        localhost start dev server and mock api in promise object <strong>WITHOUT SEND REQUEST</strong>
      </td>
    </tr>
    <tr>
      <td>npm run build</td>
      <td>build in production</td>
    </tr>
    <tr>
      <td>npm run build:gh</td>
      <td>build in production for github page special environment(BrowerRoute not working)</td>
    </tr>
    <tr>
      <td>npm run lint</td>
      <td>check {js,jsx} coding style</td>
    </tr>
    <tr>
      <td>npm run lint:fix</td>
      <td>fix {js,jsx} incorrect coding style if possible</td>
    </tr>
    <tr>
      <td>npm run preview</td>
      <td>local start server for bundled file under `/dist` folder</td>
    </tr>
    <tr>
      <td>npm run prepare</td>
      <td>run on `npm i` / `npm install`, auto install `husky` for git hook</td>
    </tr>
    <tr>
      <td>npm run prettier</td>
      <td>check {json,md,yml,sh} coding style</td>
    </tr>
    <tr>
      <td>npm run prettier:fix</td>
      <td>fix {json,md,yml,sh} incorrect coding style if possible</td>
    </tr>
    <tr>
      <td>npm run style</td>
      <td>check {css} coding style</td>
    </tr>
    <tr>
      <td>npm run style:fix</td>
      <td>fix {css} incorrect coding style if possible</td>
    </tr>
  </tbody>
</table>

<h2 id='environment-variable'>environment variable</h2>

<table width="100%">
  <thead>
    <tr>
      <th>variable</th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>MOCK</td>
      <td>
        <ul>
          <li>`npm run dev` mock jsonplaceholder api</li>
          <li>`npm run build` using mock data when fetch data failed</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>MOCK_AWS_API</td>
      <td>mock aws api (url start with `/v1`)</td>
    </tr>
    <tr>
      <td>BASENAME</td>
      <td>replace route basename to `/cwa-shop` (only for github page)</td>
    </tr>
  </tbody>
</table>

<h2 id='query-string'>query string</h2>

<table width="100%">
  <thead>
    <tr>
      <th>variable</th>
      <th>description</th>
      <th>example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>MOCK</td>
      <td>using MOCK=0 in url will force disabled api mock, useful in gh-page website (default all request in mock mode)</td>
      <td>https://sky172839465.github.io/cwa-shop/internal?MOCK=0</td>
    </tr>
  </tbody>
</table>
