
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
from .models import Task, TaskNote
from .models import Task, TaskNote, TaskAttachment
from .models import Task
import calendar
from datetime import date

# DASHBOARD
@login_required
def dashboard(request):

    # Search and filter values
    query = request.GET.get('q', '')
    priority = request.GET.get('priority', '')
    category = request.GET.get('category', '')
    sort_by = request.GET.get('sort', 'newest')

    # Logged-in user's tasks only
    all_tasks = Task.objects.filter(user=request.user)

    # Dashboard Statistics
    total_tasks = all_tasks.count()

    completed_tasks = all_tasks.filter(
        is_completed=True
    ).count()

    pending_tasks = all_tasks.filter(
        is_completed=False
    ).count()

    high_priority_tasks = all_tasks.filter(
        priority='High'
    ).count()

    medium_priority_tasks = all_tasks.filter(
    priority='Medium'
    ).count()

    low_priority_tasks = all_tasks.filter(
    priority='Low'
    ).count()

    # Task Completion Progress
    if total_tasks > 0:
        completion_percentage = int(
            (completed_tasks / total_tasks) * 100
        )
    else:
        completion_percentage = 0

    # Overdue Tasks
    today = timezone.now().date()

    overdue_tasks = all_tasks.filter(
        due_date__lt=today,
        is_completed=False
    ).order_by('due_date')

    overdue_count = overdue_tasks.count()

    # Due Date Reminder
    reminder_end_date = today + timedelta(days=3)

    due_soon_tasks = all_tasks.filter(
    due_date__gte=today,
    due_date__lte=reminder_end_date,
    is_completed=False
     ).order_by('due_date')

    due_soon_count = due_soon_tasks.count()

    # Search and Filters
    tasks = all_tasks

    if query:
        tasks = tasks.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query)
        )

    if priority:
        tasks = tasks.filter(
            priority=priority
        )

    if category:
        tasks = tasks.filter(
            category=category
        )

    # Sorting
    if sort_by == 'oldest':
        tasks = tasks.order_by('created_at')

    elif sort_by == 'due_date':
        tasks = tasks.order_by('due_date')

    else:
        tasks = tasks.order_by('-created_at')

    # Dashboard Context
    context = {
        'tasks': tasks,

        'query': query,
        'selected_priority': priority,
        'selected_category': category,
        'selected_sort': sort_by,
        'due_soon_tasks': due_soon_tasks,
        'due_soon_count': due_soon_count,

        # Statistics
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'pending_tasks': pending_tasks,
        'high_priority_tasks': high_priority_tasks,
        'medium_priority_tasks': medium_priority_tasks,
        'low_priority_tasks': low_priority_tasks,   
        # Progress Bar
        'completion_percentage': completion_percentage,

        # Overdue Tasks
        'overdue_tasks': overdue_tasks,
        'overdue_count': overdue_count,
    }

    return render(
        request,
        'tasks/dashboard.html',
        context
    )


# ADD TASK
@login_required
def add_task(request):

    if request.method == 'POST':

        title = request.POST.get('title')
        description = request.POST.get('description')
        due_date = request.POST.get('due_date')
        priority = request.POST.get('priority')
        category = request.POST.get('category')

        Task.objects.create(
            user=request.user,
            title=title,
            description=description,
            due_date=due_date,
            priority=priority,
            category=category
        )

        return redirect('dashboard')

    return render(
        request,
        'tasks/add_task.html'
    )


# EDIT TASK
@login_required
def edit_task(request, id):

    task = get_object_or_404(
        Task,
        id=id,
        user=request.user
    )

    if request.method == 'POST':

        task.title = request.POST.get('title')
        task.description = request.POST.get('description')
        task.due_date = request.POST.get('due_date')
        task.priority = request.POST.get('priority')
        task.category = request.POST.get('category')

        task.save()

        return redirect('dashboard')

    return render(
        request,
        'tasks/edit_task.html',
        {'task': task}
    )


# DELETE TASK
@login_required
def delete_task(request, id):

    task = get_object_or_404(
        Task,
        id=id,
        user=request.user
    )

    if request.method == 'POST':
        task.delete()

    return redirect('dashboard')


# COMPLETE / PENDING TASK
@login_required
def toggle_task(request, id):

    task = get_object_or_404(
        Task,
        id=id,
        user=request.user
    )

    if request.method == 'POST':

        task.is_completed = not task.is_completed
        task.save()

    return redirect('dashboard')

@login_required
def task_detail(request, task_id):

    task = get_object_or_404(
        Task,
        id=task_id,
        user=request.user
    )

    return render(
        request,
        'tasks/task_detail.html',
        {'task': task}
    )
@login_required
def add_note(request, task_id):

    task = get_object_or_404(
        Task,
        id=task_id,
        user=request.user
    )

    if request.method == 'POST':

        note_text = request.POST.get('note')

        if note_text and note_text.strip():

            TaskNote.objects.create(
                task=task,
                user=request.user,
                note=note_text
            )

    return redirect('task_detail', task_id=task.id)

@login_required
def delete_note(request, task_id, note_id):

    task = get_object_or_404(
        Task,
        id=task_id,
        user=request.user
    )

    note = get_object_or_404(
        TaskNote,
        id=note_id,
        task=task,
        user=request.user
    )

    if request.method == 'POST':
        note.delete()

    return redirect('task_detail', task_id=task.id)

@login_required
def edit_note(request, task_id, note_id):

    task = get_object_or_404(
        Task,
        id=task_id,
        user=request.user
    )

    note = get_object_or_404(
        TaskNote,
        id=note_id,
        task=task,
        user=request.user
    )

    if request.method == 'POST':

        note_text = request.POST.get('note')

        if note_text and note_text.strip():
            note.note = note_text
            note.save()

            return redirect('task_detail', task_id=task.id)

    return render(
        request,
        'tasks/edit_note.html',
        {'task': task, 'note': note}
    )

@login_required
def upload_attachment(request, task_id):

    task = get_object_or_404(
        Task,
        id=task_id,
        user=request.user
    )

    if request.method == 'POST':

        uploaded_file = request.FILES.get('file')

        if uploaded_file:

            TaskAttachment.objects.create(
                task=task,
                user=request.user,
                file=uploaded_file
            )

    return redirect('task_detail', task_id=task.id)

@login_required
def delete_attachment(request, attachment_id):

    attachment = get_object_or_404(
        TaskAttachment,
        id=attachment_id,
        user=request.user
    )

    task_id = attachment.task.id

    if request.method == 'POST':
        attachment.file.delete(save=False)
        attachment.delete()

    return redirect('task_detail', task_id=task_id)


@login_required
def task_calendar(request):

    today = date.today()

    year = int(request.GET.get('year', today.year))
    month = int(request.GET.get('month', today.month))

    # Month navigation fix
    if month < 1:
        month = 12
        year -= 1

    elif month > 12:
        month = 1
        year += 1

    cal = calendar.monthcalendar(year, month)

    tasks = Task.objects.filter(
        user=request.user,
        due_date__year=year,
        due_date__month=month
    )

    tasks_by_date = {}

    for task in tasks:
        day = task.due_date.day

        if day not in tasks_by_date:
            tasks_by_date[day] = []

        tasks_by_date[day].append(task)

    context = {
        'calendar': cal,
        'year': year,
        'month': month,
        'month_name': calendar.month_name[month],
        'tasks_by_date': tasks_by_date,
        'today': today,
    }

    return render(request, 'tasks/task_calendar.html', context)
