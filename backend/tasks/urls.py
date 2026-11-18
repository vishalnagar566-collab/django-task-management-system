from django.urls import path
from . import views
from .views import task_calendar, task_detail
from .views import add_note
from .views import delete_note
from .views import edit_note
from .views import upload_attachment
from .views import delete_attachment
from .views import task_calendar

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('add/', views.add_task, name='add_task'),
    path('edit/<int:id>/', views.edit_task, name='edit_task'),
    path('delete/<int:id>/', views.delete_task, name='delete_task'),
    path('toggle/<int:id>/', views.toggle_task, name='toggle_task'),
    path('task/<int:task_id>/', task_detail, name='task_detail'),
    path('task/<int:task_id>/add-note/', add_note, name='add_note'),
    path(
    'task/<int:task_id>/note/<int:note_id>/delete/',
    delete_note,
    name='delete_note'
),
    path(
    'task/<int:task_id>/note/<int:note_id>/edit/',
    edit_note,
    name='edit_note'
),
    path(
    'task/<int:task_id>/upload/',
    upload_attachment,
    name='upload_attachment'
),
    path(
    'attachment/<int:attachment_id>/delete/',
    delete_attachment,
    name='delete_attachment'
),
    path('calendar/', task_calendar, name='task_calendar'),
]
