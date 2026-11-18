from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    title = models.CharField(max_length=200)

    description = models.TextField()

    due_date = models.DateField()

    is_completed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


    priority = models.CharField(
    max_length=10,
    choices=[
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ],
    default='Medium'
)
    category = models.CharField(
    max_length=20,
    choices=[
        ('Personal', 'Personal'),
        ('Work', 'Work'),
        ('Study', 'Study'),
        ('Shopping', 'Shopping'),
    ],
    default='Personal'
)

class TaskNote(models.Model):

    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='notes'
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    note = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.note[:50]


class TaskAttachment(models.Model):

    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='attachments'
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    file = models.FileField(
        upload_to='task_attachments/'
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.file.name

from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='tasks_profile'
    )

    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        default='profile_pictures/default.png',
        blank=True
    )

    bio = models.TextField(
        blank=True,
        max_length=300
    )

    def __str__(self):
        return self.user.username
