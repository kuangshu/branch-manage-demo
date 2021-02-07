# 项目分支管理（讨论版）

## 分支类型

- 默认分支分为 master、dev、test 分别对应相应运行环境。其余分支为功能分支，功能类型为 feat、bugfix、hotfix 分别对应研发新功能、修复版本 bug、修复线上 bug。
- 默认分支中，除了 master 为线上分支外。主分支一般为 test 分支。@zj/packages 的主分支为 master。

## 命名规则

- 创建分支都应使用 `/` 分割类型名和分支名，feat 和 bugfix 后面默认分支名应该为对应的项目版本，hotfix 后为对应 bug 号（例：feat/v1.0.0、hotfix/9527）。
- 当一个大版本有多个 feat 分别开发时，应以类型名和具体功能命名（例：feat/text-component）。

## 分支创建 & 合并 & 删除

### 主 feat 分支

- 主 feat 分支即版本分支，当确定一个阶段的开发版本后从主分支创建。 ~~在主分支上有新的提交时，及时在 feat 分支 rebase 合并。~~
- 当提测阶段时，合并进入主分支。之后就可删除该分支。

### 功能 feat 分支

- 当有多个待开发的功能时，由具体负责研发的人员从主 feat 分支创建功能 feat 分支。
- 功能开发完成后即可通过 `git merge --no-ff` 合并进入主 feat 分支。
- merge 完成后可删除分支，后续还有修改在主 feat 上以 fix 提交

### bugfix 分支

- 在提测阶段主 feat 分支合并进入主分支后，创建当前版本的 bugfix 分支。到下一次主 feat 分支合并前，非紧急修复 bug 的提交都在该分支上提交。
- 可根据提交频率按天或按次合并进主分支。当下一个主 feat 分支提测阶段准备合并入主分支前，将 bugfix 合并进入主分支。
- 合并进入主分支后即可删除该分支。之后创建新的版本 bugfix 分支。

### hotfix 分支

- 当线上有紧急 bug 需要修复时，从主分支创建 hotfix 分支。
- 修复 bug 提交合并入主分支。
- 测试通过合并进去 master 分支后，删除分支。

> 在独立开发过程中，如功能尚未完成，应尽量在本地提交，并在开发过程中保持将源分支的更新 rebase 到自己分支。在完成功能开发后，本地提交通过 `git rebase -i [startpoint] [endpoint]` 或 `git rebase -i HEAD~[index]` 命令整理提交记录，保持每次 commit message 的内容都使用明确的 type 和清晰的内容，再提交到远端分支。如确定当前分支仅自己使用时也可整理远端的提交，通过 `git push --force-with-lease` 提交。（多人在远端分支合作开发时慎用）

## @zj/packages 版本更新策略

- 主 feat 合并到主分支开始提测准备阶段时，确定版本号后使用 `lerna version [premajor | preminor | prepatch ]` 命令手动更新一个 alpha 版本。
- 提测阶段到上线前，自动更新发版，只会更新 alpha 的版本号。上线前使用 graduate 手动更新版本为稳定版发版即可。
  > 此方式有一段时间内 bugfix 的修复会发在 alpha 版本上，直到测试完成发布稳定版本号
