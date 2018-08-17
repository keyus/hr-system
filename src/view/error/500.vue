<template>
    <div class="exception___19n05" style="min-height: 500px; height: 80%;">
        <div class="imgBlock___2g-kj">
            <div class="imgEle___cXgra httperror_500"></div>
        </div>
        <div class="content___3PvOs"><h1>500</h1>
            <div class="desc___3G5g3">抱歉，服务器出错了</div>
            <div class="actions___1lAdW">
                <router-link to="/">
                    <button type="button" class="ant-btn ant-btn-primary"><span>返回首页</span></button>
                </router-link>
                <router-link to="" @click.native="$router.back()">
                    <button type="button" class="ant-btn ant-btn-primary"><span>返回上一页</span></button>
                </router-link>
            </div>
        </div>
    </div>
</template>



