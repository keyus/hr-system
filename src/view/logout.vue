<script>
    import cookie from '../util/cookie'

    export default {
        created() {
            cookie.keys().forEach(key => cookie.removeItem(key));
            this.$store.commit('updateUser', {} );
            this.$router.push('/login');
        },
        render() {
        }
    }
</script>
