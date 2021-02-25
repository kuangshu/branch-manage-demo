# 项目分支管理（讨论版）

## 分支类型

- 默认分支分为 master、dev、test 分别对应相应运行环境。其余分支为功能分支，功能类型为 feat、bugfix、hotfix 分别对应研发新功能、修复版本 bug、修复线上 bug。
- 默认分支中，除了 master 为线上分支外。主分支一般为 test 分支。@zj/packages 的主分支为 prerelease。

## 命名规则

- 创建分支都应使用 `/` 分割类型名和分支名，feat 和 bugfix 后面默认分支名应该为对应的项目版本，hotfix 后为对应 bug 号（例：feat/v1.0.0、hotfix/9527）。
- 当一个大版本有多个 feat 分别开发时，应以类型名和具体功能命名（例：feat/text-component）。

## 分支创建 & 合并 & 删除

### 主 feat 分支

- 主 feat 分支即版本分支，当确定一个阶段的开发版本后从主分支创建。 在主分支上有新的提交时，应同步 merge 进入主分支。
- 当提测阶段开始前，应将 feat 的开发分支合并进入主分支
- 代码 merge 进入了主分支后，由项目负责人清理并删除版本以及过程中衍生分支（功能 feat 分支）。
- > 当主分支上有提交的时候，分支应同步 merge 进入主 feat 分支。  
  > 现阶段暂不考虑同时维护两个大的主 feat 分支的情况。

### 功能 feat 分支

- 当有多个待开发的功能时，由具体负责研发的人员从主 feat 分支创建功能 feat 分支。
- 功能开发完成后即可通过 `git merge --no-ff` 合并进入主 feat 分支。
- merge 完成后可删除分支，后续还有修改在主 feat 上以 fix 提交
- > 开发期间主 feat 分支上有 commit 的情况下。如果为本地开发的情况可以使用 rebase 前进 HEAD，已经推到远端的情况下，如果有完全掌控分支的能力可以使用 rebase 前进 HEAD，并使用 `-f` 参数推送到远端，否则应使用 `charry-pick <commit>` 或者在合并进入主 feat 的环节处理冲突

### bugfix 分支

- 在 feat 合并进入主分支后（即提测阶段开始），创建当前项目版本的 bugfix 分支，期间修复 bug 的提交都在该分支上提交。
- 可根据提交频率按天或按次合并进主分支。
- 当测试完全结束达到发布标准并且该分支没有新提交的情况下，或者开启下一个主 feat 分支时。可以删除该分支。

### hotfix 分支

- 当线上有紧急 bug 需要修复时，从主分支创建 hotfix 分支。
- 修复 bug 提交测试通过后合并入主分支。同时合并进入其他开发中的分支
- merge 进入 master 分支和其余并行中的分支后，删除分支。

> 在独立开发过程中，如功能尚未完成，应尽量在本地提交，并在开发过程中保持将源分支的更新 rebase 到自己分支。在完成功能开发后，本地提交通过 `git rebase -i [startpoint] [endpoint]` 或 `git rebase -i HEAD~[index]` 命令整理提交记录，保持每次 commit message 的内容都使用规范的 type ，再提交到远端分支。如确定当前分支仅自己使用时也可整理远端的提交，通过 `git push --force-with-lease` 提交。（多人在远端分支合作开发时慎用）

## @zj/packages 版本更新策略

- 主 feat 分支，在开发接近尾声，并且所有的 feat 功能分支都合并进入主 feat 分支之后，使用 `lerna version [ premajor | preminor ]` 命令确定版本号并更新 alpha 版本，在此之后应只提交 fix 的 commit，以免 alpha 版本因后续的 feat 提交提升版本号。如发现有误的提交，需使用 `rebase` 命令中的 `reword` 修改提交文字，其余已经拉过该分支的人应 reset 到之前的节点，重新 pull 远端代码 （或者如为避免犯错提测阶段前仅使用本地打包拷贝的方式，跳过整个 alpha 版本）。
- 合并到主分支（prerelease）开始提测时，使用 `lerna version prerelease` 更新 beta 版本，按以上分支管理办法，应删除主 feat 分支，创建对应版本的 bugfix 分支，此时可按天合并到 prerelease 分支发版。
- 测试完成达到发版要求后，可合并进入 master 分支，并使用 graduate 更新版本为稳定版发版即可。
- hotfix 的修复，应从主分支创建，并通过 prepatch 建立 alpha 版本，测试完成分支合并进入主分支提升一个小版本。并将该分支合并进入目前的主 feat 分支，之后可以删除分支。
