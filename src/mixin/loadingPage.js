var loadingPage = {
    created: function () {
        this.$store.commit('updateLoadingPage', true);
    },
    methods: {
        pageSuccess() {
            this.$store.commit('updateLoadingPage', false);
        }
    }
}

export default loadingPage;
