

### 1、推送错误

```xml
sign_and_send_pubkey: signing failed: agent refused operation
Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.

```

解决方式：

```
eval "$(ssh-agent -s)"
ssh-add

```