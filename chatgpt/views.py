from django.shortcuts import render
import openai
from django.http import HttpResponse
from django.http import JsonResponse
# 키값을 settings에 등록해놓았기때문
from django.conf import settings

# Create your views here.

openai.api_key = settings.OPEN_AI_API

# chatGPT에게 채팅 요청 API
def chatGPT(prompt):
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )

    result= {
        'question' : prompt,
        'answer': completion.choices[0].message.content
    }
    return result

# chatGPT에게 그림 요청 API
def imageGPT(prompt):
    response = openai.Image.create(
        prompt=prompt,
        n=1,
        size="256x256"
    )
    result= {
        'question' : prompt,
        'answer': response['data'][0]['url']
    }
    return result

def index(request):
    return render(request, 'gpt/index.html')


# json 데이터 받아서 다른 함수와 연결하는 함수
def send(request):
    data = request.POST.get('data','')
    state = request.POST.get('state','')
    callback = request.POST.get('callback','')
    
    # 실행시킬 함수 함수
    func_dic = {
        'chatGPT' : chatGPT,
        'imageGPT': imageGPT,
    }
    # 등록된 함수 실행
    data_return = func_dic[state](data)
    
    # 전송될 데이터 형식 
    restult = {
        'data' : data_return,
        'callback': callback
    }
    return JsonResponse(restult)