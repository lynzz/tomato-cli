# tomato-cli [![Build Status](https://img.shields.io/circleci/project/lynzz/tomato-cli/master.svg)](https://circleci.com/gh/lynzz/tomato-cli) [![npm package](https://img.shields.io/npm/v/tomato-cli.svg)](https://www.npmjs.com/package/tomato-cli)

用命令生成工程脚手架, fork from [vue-cli](https://github.com/vuejs/vue-cli)

> 工程文件模板改用 ejs, 因为大量组件已用了 handebars，会有冲突，因此需注意引用第三方的文件有 ejs 写法的文件

### 安装

Prerequisites: [Node.js](https://nodejs.org/en/) (>5.x preferred) and [Git](https://git-scm.com/).

``` bash
$ npm install -g tomato-cli
```

### 用法

``` bash
$ tomato init <template-name> <project-name>
```

Example:

``` bash
$ tomato init ftl my-project
```

The above command pulls the template from [tomato-templates/ftl](https://github.com/tomato-templates/ftl), prompts for some information, and generates the project at `./my-project/`.

### Official Templates

The purpose of official Vue project templates are to provide opinionated, battery-included development tooling setups so that users can get started with actual app code as fast as possible. However, these templates are un-opinionated in terms of how you structure your app code and what libraries you use in addition to Vue.js.

All official project templates are repos in the [tomato-templates organization](https://github.com/tomato-templates). When a new template is added to the organization, you will be able to run `tomato init <template-name> <project-name>` to use that template. You can also run `tomato list` to see all available official templates.

Current available templates include:

- [java-webapp](https://github.com/tomato-templates/java-webapp) - A java webapp + freemarker + seajs + spm


### Custom Templates

It's unlikely to make everyone happy with the official templates. You can simply fork an official template and then use it via `tomato-cli` with:

``` bash
tomato init username/repo my-project
```

Where `username/repo` is the GitHub repo shorthand for your fork.

The shorthand repo notation is passed to [download-git-repo](https://github.com/flipxfx/download-git-repo) so you can also use things like `bitbucket:username/repo` for a Bitbucket repo and `username/repo#branch` for tags or branches.

If you would like to download from a private repository use the `--clone` flag and the cli will use `git clone` so your SHH keys are used.

### Local Templates

Instead of a GitHub repo, you can also use a template on your local file system:

``` bash
tomato init ~/fs/path/to-custom-template my-project
```

### Writing Custom Templates from Scratch

- A template repo **must** have a `template` directory that holds the template files.

- A template repo **may** have a `meta.json` file that provides metadata for the template. The `meta.json` can contain the following fields:

  - `prompts`: used to collect user options data;

  - `filters`: used to conditional filter files to render.

  - `completeMessage`: the message to be displayed to the user when the template has been generated. You can include custom instruction here.

#### prompts

The `prompts` field in `meta.json` should be an object hash containing prompts for the user. For each entry, the key is the variable name and the value is an [Inquirer.js question object](https://github.com/SBoudrias/Inquirer.js/#question). Example:

``` json
{
  "prompts": {
    "name": {
      "type": "string",
      "required": true,
      "message": "Project name"
    }
  }
}
```

After all prompts are finished, all files inside `template` will be rendered using [ejs](https://github.com/tj/ejs), with the prompt results as the data.

##### Conditional Prompts

A prompt can be made conditional by adding a `when` field, which should be a JavaScript expression evaluated with data collected from previous prompts. For example:

``` json
{
  "prompts": {
    "lint": {
      "type": "confirm",
      "message": "Use a linter?"
    },
    "lintConfig": {
      "when": "lint",
      "type": "list",
      "message": "Pick a lint config",
      "choices": [
        "standard",
        "airbnb",
        "none"
      ]
    }
  }
}
```

The prompt for `lintConfig` will only be triggered when the user answered yes to the `lint` prompt.


#### File filters

The `filters` field in `meta.json` should be an object hash containing file filtering rules. For each entry, the key is a [minimatch glob pattern](https://github.com/isaacs/minimatch) and the value is a JavaScript expression evaluated in the context of prompt answers data. Example:

``` json
{
  "filters": {
    "test/**/*": "needTests"
  }
}
```

Files under `test` will only be generated if the user answered yes to the prompt for `needTests`.

Note that the `dot` option for minimatch is set to `true` so glob patterns would also match dotfiles by default.
