from django.shortcuts import render, render_to_response
from django.http.response import HttpResponse, HttpResponseRedirect, Http404
from django.views.generic import View
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .models import MyUser


class LoginView(View):

    def get(self, request):
        return render(request, "login.html")

    def post(self, request):
        username = request.POST.get("username", "")
        pwd = request.POST.get("password", "")
        print(username + ": " + pwd)
        user = auth.authenticate(username=username, password=pwd)
        if user is not None:
            auth.login(request, user)
            return render(request, "success.html")
        else:
            return render(request, "fail.html")


class RegisterView(View):


    def get(self, request):
        pass

    def post(self, request):
        errors = []
        username = request.POST.get("username", "")
        pwd1 = request.POST.get("password", "")
        pwd2 = request.POST.get("password", "")
        if(pwd1 != pwd2):
            errors.append("两次输入密码不一致")
        else:
            user = User.objects.create_user(username, pwd1)
            user.save()
            user = auth.authenticate(username=username, password=pwd1)
            auth.login(request, user)
            return HttpResponseRedirect('/')

        return render_to_response("register.html", {'errors': errors})

class TestView(View):

    def get(self, request):
        print("user: " + str(request.user))
        if not request.user.is_authenticated:
            return HttpResponse("未认证")

        return HttpResponse("已认证")