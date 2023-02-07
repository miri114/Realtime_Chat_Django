from django.shortcuts import render

# Create your views here.

def messages_pg(request):
    return render(request, 'chat/messages.html')