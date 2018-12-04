from django.contrib import admin

from .models import BasicInfo

# Register your models here.


class BasicInfoAdmin(admin.ModelAdmin):
    list_display = ["name", "university", "theme_list", ]
    list_filter = ["university", ]
    search_fields = ["name", ]

admin.site.register(BasicInfo, BasicInfoAdmin)
admin.site.site_header = 'EDMS后台管理系统'
admin.site.site_title = 'EDMS'