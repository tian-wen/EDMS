from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from expert.models import BasicInfo


class MyUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=255, blank=False, null=True, db_index=True)

    class Meta:
        verbose_name = "自定义用户"

    def __str__(self):
        return self.nickname

# class CustomUser(AbstractUser):
#     nickname = models.CharField(max_length=255, blank=False, null=True, db_index=True)
#
#     class Meta:
#         verbose_name = "用户信息"
#
#     def __str__(self):
#         return self.nickname


class ExpertGroup(models.Model):
    name = models.CharField(max_length=255, verbose_name="专家分组名")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    expert = models.ForeignKey(BasicInfo, blank=True, null=True, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "专家分组信息"

    def __str__(self):
        return self.user.name + ":" + self.name


class UserFav(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    expert = models.ForeignKey(BasicInfo, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "用户收藏"

    def __str__(self):
        return self.name + "的收藏"