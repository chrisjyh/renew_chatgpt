$(document).ready(function(){
    // 버튼 전체 처리
    $('.btn').on('click',function(){
        
        console.log('bbbbbbbbbbbb')
        if($(this).hasClass("gpt_send") === true) {
            // gpt api 불러오는 버튼
            let input_val = $("textarea[name='question']").val();
            let radio_val = $("input[name='choice_chat']:checked").val();
            
            if (radio_val == 'text'){
                send(input_val,"chatGPT","answer_uplist")
            }
            else{
                send(input_val,"imageGPT","answer_img_uplist")
            }

        } else if($(this).hasClass("img_send") === true){
            // 수어 gpt 전송 버튼
            send("input_val","chatGPT","answer_uplist")
            console.log("hi")
        }
    });

    $('textarea').on('keyup', function() {
        adjustHeight();
    });
});

// 텍스트에리어 높이값 자동조절
function adjustHeight(){
    var textEle = $('textarea');
    textEle[0].style.height = 'auto';
    var textEleHeight = textEle.prop('scrollHeight');
    textEle.css('height', textEleHeight);
}
// 로딩을 삭제하고 생성
function loading(state){
    html = `
    <div class="loader-wrapper">
        <div class="packman"></div>
        <div class="dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    </div>`;
    if (state == 'start'){
        $(".btn").attr("disabled", true);
        $('.btn_box').append(html)
    } 
    else if (state == 'end'){
        $('.btn_box > div').remove('.loader-wrapper')
        $(".btn").attr("disabled", false);
    }
}

// 전달받은 결과를 리스트에 출력
function answer_uplist(data){
    html = `
        <li>
            <strong class="gpt_question">Q : ${data.question} </strong>
            <p class="gpt_answer">A : {{__change__}} </p>
        </li>
    `;
    html = html.replace('{{__change__}}', data.answer)
    $('.answer_list').prepend(html)
}

function answer_img_uplist(data){
    console.log(data)
    html = `
        <li>
            <strong class="gpt_question">Q : ${data.question} </strong>
            <img src='{{__change__}}' class="list_img">
        </li>
    `;
    html = html.replace('{{__change__}}', data.answer)
    $('.answer_list').prepend(html)
}

function send(data, state, callback='empty'){
    loading('start');
    // csrf 토큰 찾아주는 함수
    const csrftoken = getCookie('csrftoken');
    // 콜백시 실행할 함수  
    $.ajax({
        headers: {'X-CSRFToken': csrftoken},
        url: 'send',
        type: 'POST',
        data: {
            'data': data, // 보낼 데이터
            'state': state, // 뷰단에서 처리할 함수
            'callback': callback // 뷰에서 처리하고 돌아오는 함수
        },
        datatype: 'json', // 서버에서 반환되는 데이터 json 형식
        success: function(data){ 
            callback = data.callback;
            result = data.data;
            const fun_dict = {
                'empty': console.log,
                'answer_uplist': answer_uplist,
                'answer_img_uplist':answer_img_uplist,
            }
            fun_dict[callback](result)
            loading('end');
        }
    });
}


// 쿠키에서 csrf 토큰
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}