# tomato-cli [![Build Status](https://img.shields.io/circleci/project/lynzz/tomato-cli/master.svg)](https://circleci.com/gh/lynzz/tomato-cli) [![npm package](https://img.shields.io/npm/v/tomato-cli.svg)](https://www.npmjs.com/package/tomato-cli)

用命令生成项目脚手架, fork from [vue-cli](https://github.com/vuejs/vue-cli)

> 工程文件模板改用 ejs, 因为大量组件已用了 handebars，会有冲突，因此需注意引用第三方的文件有 ejs 写法的文件

### 安装

需要: [Node.js](https://nodejs.org/en/) (>5.x preferred) and [Git](https://git-scm.com/).

``` bash
$ npm install -g tomato-cli
```

### 用法

``` bash
$ tomato init <template-name> <project-name>
```

举例:

``` bash
$ tomato init java-webapp my-project
```

模板来自 [tomato-templates/java-webapp](https://github.com/tomato-templates/java-webapp), 最终生成的文件在 `./my-project/`.

### 线上模板

线上模板只是提供工作上常用的模板

所有线上模板在 [tomato-templates organization](https://github.com/tomato-templates)。 如有新模块被添加，可运行 `tomato init <template-name> <project-name>` 来运用模板。 你也可以 `tomato list` 查看线上可用的模板。

目前已有模板:

- [java-webapp](https://github.com/tomato-templates/java-webapp) - A java webapp + freemarker + seajs + spm


### 自定义模板

如果线上模板不能满足你的需求，发现 github 已有模板刚好适合你的需求，这时可以这样做:

``` bash
tomato init username/repo my-project
```

Where `username/repo` is the GitHub repo shorthand for your fork.

The shorthand repo notation is passed to [download-git-repo](https://github.com/flipxfx/download-git-repo) so you can also use things like `bitbucket:username/repo` for a Bitbucket repo and `username/repo#branch` for tags or branches.

If you would like to download from a private repository use the `--clone` flag and the cli will use `git clone` so your SHH keys are used.

### 本地模板

你可能需要运用本地的模板，可以这样做:

``` bash
tomato init ~/fs/path/to-custom-template my-project
```

### 怎么写自定义模板

- 你的模板包必须有一个 `template` 目录，用来存放模板文件的目录 

- 你的模板包必须有一个 `meta.json` ，这是提供模板的默认配置文件，它可以包含如下字段:

  - `prompts`: 用来提示用户操作的信息;

  - `filters`: 过滤不想被 `render` 的文件;

  - `completeMessage`: 当模板生成完成后，要显示给用户的信息;

#### 模板提示信息

在 `meta.json` 里有一个用户信息对象 `prompts`，它的 `key` 就是变量名，值就是一个 [Inquirer.js question object](https://github.com/SBoudrias/Inquirer.js/#question)。 例如:

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

这些参数值会通过 [ejs](https://github.com/tj/ejs), 把值 `render` 到 `template` 目录里的模板文件

##### 条件提示信息

添加 `when` 字段, 可做条件式提示，例如:

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

当用户确认选择 `lint` ，`lintConfig` 才能被触发生效。 

#### 文件过滤

在 `meta.json` 文件的 `filters`, 它是一个文件过滤规则对象。 它的 `key` 是一个 [minimatch glob pattern](https://github.com/isaacs/minimatch)，它的值是一个提示信息作用域下的具体一个值. Example:

``` json
{
  "filters": {
    "test/**/*": "needTests"
  }
}
```

只用用户选择需要 `needTests` , `test` 目录下的文件才会被创建

#### TODO

- [ ] 支持 gitlab 内网包的下载
