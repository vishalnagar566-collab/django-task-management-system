
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, PasswordChangeForm
from django.contrib.auth import login, logout, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .models import Profile


@login_required
def profile_view(request):
    profile, created = Profile.objects.get_or_create(
        user=request.user,
        defaults={'bio': ''}
    )

    return render(
        request,
        'accounts/profile.html',
        {'profile': profile}
    )


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)

        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('dashboard')
    else:
        form = UserCreationForm()

    return render(request, 'accounts/register.html', {'form': form})


def user_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)

        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('dashboard')
    else:
        form = AuthenticationForm()

    return render(request, 'accounts/login.html', {'form': form})


@login_required
def user_logout(request):
    logout(request)
    return redirect('login')


@login_required
def edit_profile(request):

    profile, created = Profile.objects.get_or_create(
        user=request.user,
        defaults={'bio': ''}
    )

    error = None

    if request.method == 'POST':

        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        bio = request.POST.get('bio', '').strip()
        profile_picture = request.FILES.get('profile_picture')

        # Username validation
        if not username:
            error = "Username cannot be empty."

        elif User.objects.filter(username__iexact=username).exclude(
            pk=request.user.pk
        ).exists():
            error = "This username is already taken."

        # Email validation
        elif email:
            try:
                validate_email(email)
            except ValidationError:
                error = "Please enter a valid email address."

        if not error:

            request.user.username = username
            request.user.email = email
            request.user.save()

            profile.bio = bio

            if profile_picture:
                profile.profile_picture = profile_picture

            profile.save()

            return redirect('profile')

    return render(
        request,
        'accounts/edit_profile.html',
        {
            'profile': profile,
            'error': error
        }
    )


@login_required
def change_password(request):

    if request.method == 'POST':
        form = PasswordChangeForm(
            user=request.user,
            data=request.POST
        )

        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)

            return redirect('profile')

    else:
        form = PasswordChangeForm(user=request.user)

    return render(
        request,
        'accounts/change_password.html',
        {'form': form}
    )


@login_required
def delete_account(request):

    error = None

    if request.method == 'POST':

        password = request.POST.get('password', '')

        if request.user.check_password(password):

            user = request.user

            logout(request)
            user.delete()

            return redirect('login')

        else:
            error = "Incorrect password. Please try again."

    return render(
        request,
        'accounts/delete_account.html',
        {'error': error}
    )
