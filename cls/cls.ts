

import prompt from "prompt-sync"
import * as manager from "fs-extra"

export class File {
    osPath: string
    private _content: string
    
    constructor(osPath: string, content: string) {
        this.osPath = osPath
        this._content = content
    }

    get content(): string {
        return this._content
    }

    set content(newValue: string) {
        this._content = newValue
    }
    write(): void {
        manager.writeFileSync(this.osPath, this.content, "utf8")
    }
    append(): void {
        manager.appendFileSync(this.osPath, this.content, "utf8")
    }
    read(): string {
        return manager.readFileSync(this.osPath, "utf8")
    }
}

export class Perfil {
    private _id: number 
    private _nome: string
    private _email: string
    
    constructor(id: number, nome: string, email: string) {
        this._id = id
        this._nome = nome
        this._email = email
    }

    get id(): number {
        return this._id
    }

    get nome(): string {
        return this._nome
    }

    get email(): string {
        return this._email
    }
}

export class Postagem {
    _id: number
    _texto: string
    _curtidas: number
    _descurtidas: number
    _data: string
    _perfil: Perfil

    constructor(id: number, texto: string, curtidas: number, descurtidas: number, data: string, perfil: Perfil) {
        this._id = id
        this._texto = texto
        this._curtidas = curtidas
        this._descurtidas = descurtidas
        this._data = data
        this._perfil = perfil
    } 

    get id(): number {
        return this._id
    }

    get texto(): string {
        return this._texto
    }

    get curtidas(): number {
        return this._curtidas
    }

    set curtidas(newValue: number) {
        this._curtidas = newValue
    }

    get descurtidas(): number {
        return this._descurtidas
    }

    set descurtidas(newValue: number) {
        this._descurtidas = newValue
    }

    get data(): string {
        return this._data
    }

    get perfil(): Perfil {
        return this._perfil
    }

    curtir(): void {
        this.curtidas++
    }

    descurtir(): void {
        this.descurtidas++
    }

    ehPopular(): boolean {
       return this.curtidas > (this.descurtidas * 50/100) ? true : false
    }
}

export class PostagemAvancada extends Postagem {
    private _hashtags: string[]
    private _visualizacoesRestantes: number 
    
    constructor(
        id: number, texto: string, curtidas: number, descurtidas: number, data: string, perfil: Perfil,
        hashtags: string[], visualizacoesRestantes: number
        ) {
        super(id, texto, curtidas, descurtidas, data, perfil)
        this._hashtags = hashtags
        this._visualizacoesRestantes = visualizacoesRestantes 
    }

    get hashtags(): string[] {
        return this._hashtags
    }

    get visualizacoesRestantes(): number {
        return this._visualizacoesRestantes
    }

    set visualizacoesRestantes(newValue: number) {
        this._visualizacoesRestantes = newValue
    }
    
    // Check if a certain advanced post has in its "hashtags" attrib. the hashtag passed
    adicionarHashtag(hashtag: string): void {
        if (this.existeHashtag(hashtag)) {
            console.log(new Messages().msg.warn)
            console.log(new Messages().msg.fail.hashtagExists)
            return
        } 
        console.log(new Messages().msg.warn)
        console.log(new Messages().msg.success.hashtagAdded)
        this.hashtags.push(hashtag)
    }

    existeHashtag(hashtag: string): boolean {
        return this.hashtags.includes(hashtag) ? true : false
    }
    
    // For when a post is viewed (but not on all cases) (the post is not chosen and its view removed)
    // Bug
    decrementarVisualizacoes(): void {
        this.visualizacoesRestantes = this.visualizacoesRestantes - 1 
    }
}

export class RepositorioDePerfis {
    private _perfis: Perfil[]
    // added later
    lastId: number

    constructor(perfis: Perfil[]) {
        this._perfis = perfis
        // added later
        this.lastId = 0
    }

    get perfis(): Perfil[] {
        return this._perfis
    }

    incluir(perfil: Perfil): void {
        !this.consultar(perfil.id) ? this.perfis.push(perfil) : null
    }
    
    /*
        It is being asked to return "null", but I do not know how to do it in a way professor wants
        It will return undefined instead
    */
    consultar(id: number): Perfil {
        let searchedProfile!: Perfil
        for (let i = 0; i < this.perfis.length; i++) {
            if (id == this.perfis[i].id) {
                return this.perfis[i]
            }
        }
        return searchedProfile
    }

    getProfileRepositorySize(): number {
        return this.perfis.length
    }
    
    /*
        After each new profile added, this value will track the history of indexes record
       "txt/last_id_profile.txt" file will make use of it
    */
    updateId(): void {
        this.lastId++
    }
}

export class RepositorioDePostagens {
    private _postagens: Postagem[]
    mockProfile: Perfil
    mockAdvancedPost: PostagemAvancada
    lastId: number

    constructor(postagem: Postagem[]) {
        this._postagens = postagem
        this.mockProfile = new Perfil(-1, "Void", "void@gmail.com")
        this.mockAdvancedPost = new PostagemAvancada(-1, "void", 0, 0, "01-01-01", this.mockProfile, ["#void"], 0)
        this.lastId = 0
    }

    get postagens(): Postagem[] {
        return this._postagens
    }
    
    // In here, there is no need to verify instance, it will add "Postagem" and "PostagemAvancada"
    // Why would you want to verify if a post is repeated or not? does not make sens at all
    incluir(postagem: Postagem): void {
        this.postagens.push(postagem)
    }
    
    consultar(id: number, hashtag: string): Postagem[] {
        const posts: Postagem[] = []
        
        for(let i = 0; i < this.postagens.length; i++) {
            const currentPost: Postagem = this.postagens[i]
            id == currentPost.perfil.id ? posts.push(currentPost) : null 
            
            // Normal post uses profile as search reference 
            // if (currentPost instanceof Postagem && !(currentPost instanceof PostagemAvancada)) {
            //     const currentPostPersonId: number = currentPost.perfil.id
            //     id == currentPostPersonId ? posts.push(currentPost) : null  
            // }
            // Advanced post uses hashtag as reference
            
            if (currentPost instanceof PostagemAvancada) {
                currentPost.hashtags.includes(hashtag) ? posts.push(currentPost) : null
            }
            
        }
        return posts
    }

    consultarUnico(postId: number): Postagem {
        // This will return an array with only one post instance expected
        const thePost: Postagem[] = this.postagens.filter((i: Postagem) => {
            if (i.id === postId) {
                return true
            }
            return false
        })
        // If the post id does not exist, insert the mock one inside this class
        thePost.length == 0 ? thePost.push(this.mockAdvancedPost) : null
        return thePost[0]
    }

    getPostsRepositorySize(): number {
        return this.postagens.length
    }

    // Support
    getAdvancedPosts(): PostagemAvancada[] {
        let postsFilter: Postagem[] = this.postagens.filter((i: Postagem) => {
            if (i instanceof PostagemAvancada) {
                return true
            }
            return false
        })
        // This is done to avoid error ts(2322)
        const advancedPosts: PostagemAvancada[] = []
        postsFilter.forEach(i => {i instanceof PostagemAvancada ? advancedPosts.push(i) : null})
        postsFilter = []
        return advancedPosts
    }

    // Support
    getAdvancedPostsHashtags(arrayPosts: PostagemAvancada[]): string[] {
        const arrayHashtags: string[] = []
        for (let i = 0; i < arrayPosts.length; i++) {
            // Add each hashtag [j] from each index of arrayPosts [i]
            for (let j = 0; j < arrayPosts[i].hashtags.length; j++) {
                arrayHashtags.push(arrayPosts[i].hashtags[j])
            }
        }
        return arrayHashtags
    }
    
    // Support
    showSpecificPosts(arrayPosts: Postagem[]): void {
        console.log("\n[")
        for (let i = 0; i < arrayPosts.length; i++) {
            const thisPost: Postagem = arrayPosts[i]
            console.log(thisPost)
        }
        console.log("]")
    }

    /*
        After each new post added, this value will track the history of indexes record
       "txt/last_id_post.txt" file will make use of it
    */
    updateId() {
        this.lastId++
    }
}

export class RedeSocial {
    private _repPerfis: RepositorioDePerfis
    private _repPosts: RepositorioDePostagens

    constructor(repPerfis: RepositorioDePerfis, repPosts: RepositorioDePostagens) {
        this._repPerfis = repPerfis
        this._repPosts = repPosts
    }

    get repPerfis(): RepositorioDePerfis {
        return this._repPerfis
    }

    get repPosts(): RepositorioDePostagens {
        return this._repPosts
    }

    incluirPerfil(perfil: Perfil): number {
        for (let i = 0; i < this.repPerfis.perfis.length; i++) {
            if (perfil.id == this.repPerfis.perfis[i].id) {
                return 1
            }
        }
        if (
            perfil.nome != undefined && perfil.nome != "" &&
            perfil.email != undefined && perfil.email != ""
            ) {
            (<RepositorioDePerfis> this.repPerfis).incluir(perfil)
            return 0
        }
        return 1
    }

    consultarPerfil(id: number, nome: string, email: string): Perfil {
        return (<RepositorioDePerfis> this.repPerfis).consultar(id)
    }

    incluirPostagem(postagem: Postagem): number {
        let p = postagem
        let postFields: number[] = []
        
        // Regular post
        if (p instanceof Postagem && !(postagem instanceof PostagemAvancada)) {
            postFields.push(p.data === undefined || p.data === "" ? 1 : 0)
            postFields.push(p.texto === undefined || p.texto === "" ? 1 : 0)
            postFields.push(p.id === undefined || p.id < 0 ? 1: 0)
            postFields.push(p.curtidas === undefined || p.curtidas < 0 ? 1 : 0)
            postFields.push(p.descurtidas === undefined || p.descurtidas < 0 ? 1 : 0)
            postFields.push(p.perfil === undefined ? 1 : 0)    
        } 
        // Advanced post
        if (p instanceof PostagemAvancada) {
            postFields.push(p.data === undefined || p.data === "" ? 1 : 0)
            postFields.push(p.texto === undefined || p.texto === "" ? 1 : 0)
            postFields.push(p.id === undefined || p.id < 0 ? 1: 0)
            postFields.push(p.curtidas === undefined || p.curtidas < 0 ? 1 : 0)
            postFields.push(p.descurtidas === undefined || p.descurtidas < 0 ? 1 : 0)
            postFields.push(p.perfil === undefined ? 1 : 0)
            postFields.push(p.hashtags.length === 0 ? 1 : 0)
            postFields.push(p.curtidas === undefined || p.curtidas < 0 ? 1 : 0)
        }
        
        const undefinedCountage: number = postFields.reduce((current, next) => {return current + next})
            
        // If there is no invalid attribute
        if (undefinedCountage === 0) {
            for (let i = 0; i < this.repPosts.postagens.length; i++) {
                // Check for existence of repeated id. If there is, function breaks and nothing is added
                if (postagem.id === this.repPosts.postagens[i].id) {
                    return 1
                }
            }
            // If post is ok, it is added to the posts repository
            (<RepositorioDePostagens> this.repPosts).incluir(postagem)
        }
        return undefinedCountage
    }

    consultarPostagens(id: number, texto: string, hashtag: string, perfil: Perfil): Postagem[] {
        return (<RepositorioDePostagens>this.repPosts).consultar(id, hashtag)
    }

    curtir(idPostagem: number): void {
        for(let i = 0; i < this.repPosts.postagens.length; i++) {
            if (idPostagem == this.repPosts.postagens[i].id) {
                (<Postagem>this.repPosts.postagens[i]).curtir()
            }
        }
    }

    descurtir(idPostagem: number): void {
        for(let i = 0; i < this.repPosts.postagens.length; i++) {
            if (idPostagem == this.repPosts.postagens[i].id) {
                if (this.repPosts.postagens[i].curtidas > 0) {
                    (<Postagem>this.repPosts.postagens[i]).descurtir()
                }
            }
        }
    }
    
    decrementarVisualizacoes(postagem: PostagemAvancada): void {
        if (postagem.visualizacoesRestantes > 0) {
            (<PostagemAvancada> postagem).decrementarVisualizacoes()
        }
    }
    
    exibirPostagensPorPerfil(id: number): Postagem[] {
        // First: take all posts from a certain profile id
        // Others outside the "ifs" will be excluded (return false)
        let profilePosts: Postagem[] = this.repPosts.postagens.filter((i: Postagem) => {
            if (i.perfil.id == id) {
                return true
            }
            return false
        })
        
        // Second: From the current array, remove views from advanced posts
        // profilePosts.forEach(i => {
        //     i instanceof PostagemAvancada ? this.decrementarVisualizacoes(i) : null
        // })
        
        // Third: include advanced posts with 1+ views left OR regular posts
        // Others outside the "ifs" will be excluded (return false)
        profilePosts = profilePosts.filter((i: Postagem) => {
            if (i instanceof PostagemAvancada && i.visualizacoesRestantes > 0 || 
                i instanceof Postagem && !(i instanceof PostagemAvancada)) {
                return true
            }
            return false
        })
        
        return profilePosts
    }

    exibirPostagensPorHashtag(hashtag: string): PostagemAvancada[] {
        // 2 operations at once were not working, so at first: get advanced posts and recude their views
        let advancedPosts: Postagem[] = this.repPosts.postagens.filter((i: Postagem) => {
            if (i instanceof PostagemAvancada) {
                // this.decrementarVisualizacoes(i)
                return true
            }
            return false
        })
        
        // The second operation also requires asking instance in order for the 2 && work
        advancedPosts = advancedPosts.filter((i: Postagem) => {
            if (i instanceof PostagemAvancada && i.visualizacoesRestantes > 0 && i.hashtags.includes(hashtag)) {
                return true
            }
            return false
        })
        
        // This was done because I could not solve how to return "advancedPosts" without issues
        let advancedPostsFinal: PostagemAvancada[] = []
        advancedPosts.forEach(i => {
            i instanceof PostagemAvancada ? advancedPostsFinal.push(i) : null
        })
        return advancedPostsFinal
    }

    decrementarViewsAposExibir(array: Postagem[]) {
        array.forEach(i => {
            i instanceof PostagemAvancada ? this.decrementarVisualizacoes(i) : null
        })
    }

    // Treatment for date handling (not complete though)
    handleDate(date: string, separator: string): boolean {
        let correct: number = 0
        const dateArray: string[] = date.split(separator)
        Number(dateArray[0]) <= new Date().getFullYear() ? correct++ : null
        Number(dateArray[1]) <= 12 ? correct++ : null
        Number(dateArray[2]) <= 31 ? correct++ : null
        Number(dateArray[0]) <= 9 ? dateArray[0] = `0${dateArray[0]}` : null
        Number(dateArray[1]) <= 9 ? dateArray[1] = `0${dateArray[1]}` : null
        Number(dateArray[2]) <= 9 ? dateArray[0] = `0${dateArray[2]}` : null
        return correct == 3 ? true : false
    }
}

export class App {
    private _redeSocial: RedeSocial
    
    // Content for algorithm handling
    auto: boolean
    operation: string
    input
    
    // Text files variables
    profilesTxt: File
    postsTxt: File
    profileLastId: File
    postLastId: File

    // Content for empty parameters
    mockProfile: Perfil
    mockPost: Postagem
    mockAdvancedPost: PostagemAvancada
 
    constructor(redeSocial: RedeSocial, auto: boolean=false) {
        this._redeSocial = redeSocial
        this.auto = auto
        this.input = prompt()
        this.operation = ""
        this.profilesTxt = new File("../txt/profiles.txt", "")
        this.postsTxt = new File("../txt/posts.txt", "")
        this.profileLastId = new File("../txt/last_id_profile.txt", "")
        this.postLastId = new File("../txt/last_id_post.txt", "")
        this.mockProfile = new Perfil(-1, "Void", "void@gmail.com")
        this.mockPost = new Postagem(-1, "void", 0, 0, "01-01-01", this.mockProfile)
        this.mockAdvancedPost = new PostagemAvancada(-1, "void", 0, 0, "01-01-01", this.mockProfile, ["#void"], 0)
        
        this.auto ? this.start() : null
    }

    get redeSocial(): RedeSocial {
        return this._redeSocial
    }

    // Main
    start(): void {
        /* ========== PROFILE AND POSTS REPOSITORIES LAST INDEXES ==========
        
        Single values placed into: ["txt/last_id_profile.txt", "txt/last_id_post.txt"]
        Store into the document containers the last index value from each repository
        This way, the next object created (profile or post) will have its id based on these values
        */
        this.retrieveProfileLastId()
        this.retrievePostLastId()

        /* ===== PROFILE AND POSTS CONTENTE MANAGEMENT =====
        Retrieve content from ["txt/posts.txt", "txt/profiles.txt"] before the algorithm starts
        The content from both will be placed as instances from each repository
        Each line from each document is converted to an instance and appended to the arrays of instances
        This will, there will be no data loss, because history has always been retrieved
        */
        this.retrieveProfileData()
        this.retrievePostData()
        
        // Start
        console.clear()
        do {
            console.log(this.menu())
            this.operation = this.requestInput(new Messages().msg.inputs.askOperationValue)
            this.conditionals()
        } while(this.operation != "0")
        
        // The wipe must happen before any change on
        this.removeAdvancedPostsWithoutViews()
        
        /*
        ========== PROFILE MANAGEMENT ==========
        Record into documents the last index from each repository
        Before recording, wipe old content, and when leaving, record new content
        */
        this.recordProfileLastId()
        this.wipeOldProfileData()    
        this.recordNewProfileData()

        /* ========== POSTS MANAGEMENT ==========
        Before recording, wipe old content, and when leaving, record new content
        */
        this.recordPostsLastId()
        this.wipeOldPostData()
        this.recordNewPostData()

        // End
        this.hitEnter()
        console.log(new Messages().msg.warn)
        console.log(new Messages().msg.success.appClosed)
    }
    
    // Using set method from "RepositorioDePerfis"
    retrieveProfileLastId(): void {
        this.redeSocial.repPerfis.lastId = Number(this.profileLastId.read())
    }

    // Using set method from "RepositorioDePostagens"
    retrievePostLastId(): void {
        this.redeSocial.repPosts.lastId = Number(this.postLastId.read())
    }

    // To be used before algorithm start
    retrieveProfileData(): void {
        const profilesData = this.profilesTxt.read().split("\n")
        for (let i = 0; i < profilesData.length; i++) {
            // There is an empty line after appending rows, so this is required
            if (profilesData[i] != "") {
                const p: string[] = profilesData[i].split(";")
                const retrievedProfile: Perfil = new Perfil(Number(p[0]), p[1], p[2])
                this.redeSocial.incluirPerfil(retrievedProfile)
            }
        }
    }

    // To be used before algorithm start
    retrievePostData(): void {
        const postsData = this.postsTxt.read().split("\n")
        for (let i = 0; i < postsData.length; i++) {
            // There is an empty line after appending rows, so this is required
            if (postsData[i] != "") {
                const p: string[] = postsData[i].split(";")
                const profileId: number = Number(p[5])
                const profileExists: Perfil = this.redeSocial.consultarPerfil(profileId, "void", "void")
                
                // If the id collected in the row actually belongs to a user
                if (profileExists) {
                    // Regular post
                    if (p.length == 6) {
                        const retrievedPost: Postagem = new Postagem(
                            Number(p[0]), p[1], Number(p[2]), Number(p[3]), p[4], profileExists
                        )
                        this.redeSocial.incluirPostagem(retrievedPost)
                    }
                    // Advanced post
                    if (p.length > 6) {
                        const hashtagFromRowToArray: string[] = p[6].split(",")
                        const retrievedPost: PostagemAvancada = new PostagemAvancada(
                            Number(p[0]), p[1], Number(p[2]), Number(p[3]), p[4], profileExists,
                            hashtagFromRowToArray, Number(p[7])
                        )
                        this.redeSocial.incluirPostagem(retrievedPost)
                    }
                }
            }
        }
    }

    menu(): string {
        return `
        ========== APLICAÇÃO: REDE SOCIAL ==========
        0. Sair
        1. incluir Perfil
        2. consultar Perfil
        3. incluir Postagem
        4. consultar Postagens
        5. curtir
        6. descurtir
        7. decrementar visualizações
        8. exibir postagens por perfil
        9. exibir postagens por hashtag
        
        ===== CONSULTAS =====
        10. Ver repositório de perfis
        11. Ver repositório de postagens
        12. Postagens mais populares
        13. Hashtags mais populares

        ===== EDITAR =====
        14. adicionar hashtag
        `
    }
    
    requestInput(sentence: string, empty: boolean=false): string {
        console.log(sentence)
        let data: string
        empty ? data = this.input("") : data = this.input(">>> ")
        return data
    }

    requestNumberInput(sentence: string, empty: boolean=false): number {
        console.log(sentence)
        let data: number
        empty ? data = Number(this.input("")) : data = Number(this.input(">>> "))
        return data
    }

    // Auxiliar
    removeAdvancedPostsWithoutViews(): void {
        for (let i = 0; i < this.redeSocial.repPosts.postagens.length; i++) {
            const p: Postagem = this.redeSocial.repPosts.postagens[i]
            p instanceof PostagemAvancada && p.visualizacoesRestantes == 0 
            ?  this.redeSocial.repPosts.postagens.splice(i, 1)
            : null
        }
    }
    
    recordProfileLastId(): void {
        this.profileLastId.content = `${this.redeSocial.repPerfis.lastId}`
        this.profileLastId.write()
    }

    wipeOldProfileData(): void {
        this.profilesTxt.content = ""
        this.profilesTxt.write()
    }

    // Before algorithm ceases: update "new profile" content into its container file
    recordNewProfileData(): void {
        let row: string = ""
        for (let i = 0; i < this.redeSocial.repPerfis.perfis.length; i++) {
            const profile: Perfil = this.redeSocial.repPerfis.perfis[i]
            row = `${profile.id};${profile.nome};${profile.email}`
            this.profilesTxt.content = row + '\n'
            this.profilesTxt.append()
        }
    }

    recordPostsLastId(): void {
        this.postLastId.content = `${this.redeSocial.repPosts.lastId}`
        this.postLastId.write()
    }

    wipeOldPostData(): void {
        this.postsTxt.content = ""
        this.postsTxt.write()
    }

    // Before algorithm ceases: update "new post" content into its container file
    recordNewPostData(): void {
        /*
            ===== FOR ALL KINDS OF POSTS =====
            Instead of putting the entire profile content, insert only its id: row = `...${p.perfil.id}`
            
            ===== FOR ADVANCED POSTS =====
            The array of hashtags is improper, so the array is turned into a string
            ["#gastronomia", "#estrognofe_com_farofa"] = ;#gastronomia,#estrogonofe_com_farofa;
        */
        for (let i = 0; i < this.redeSocial.repPosts.postagens.length; i++) {
            let row: string = ""
            const p: Postagem = this.redeSocial.repPosts.postagens[i]
            
            // Regular post
            if (p instanceof Postagem && !(p instanceof PostagemAvancada)) {
                row = `${p.id};${p.texto};${p.curtidas};${p.descurtidas};${p.data};${p.perfil.id}`
            }
            
            // Advanced post
            if (p instanceof PostagemAvancada) {
                row = `${p.id};${p.texto};${p.curtidas};${p.descurtidas};${p.data};${p.perfil.id};${p.hashtags.toString()};${p.visualizacoesRestantes}`
            }

            // Creating row content and inserting it into file
            this.postsTxt.content = row + '\n'
            this.postsTxt.append()
        }
    }

    hitEnter(): void {
        this.requestInput(new Messages().msg.inputs.pressEnter, true)
    }
    
    // Cases
    conditionals(): void {
        switch(this.operation) {
            case "1":
                console.log(new Messages().msg.operations.includeProfile)
                this.incluirPerfil()
                break
            case "2":
                console.log(new Messages().msg.operations.searchProfile)
                this.consultarPerfil()
                break
            case "3":
                console.log(new Messages().msg.operations.includePost)
                this.incluirPostagem()
                break
            case "4":
                console.log(new Messages().msg.operations.queryPost)
                this.consultarPostagem()
                break
            case "5":
                console.log(new Messages().msg.operations.likePost)
                this.curtir()
                break
            case "6":
                console.log(new Messages().msg.operations.unlikePost)
                this.descurtir()
                break
            case "7":
                console.log(new Messages().msg.operations.lessView)
                this.decrementarViews()
                break
            case "8":
                console.log(new Messages().msg.operations.showPostsByProfile)
                this.exibirPostagensPorPerfil()
                break
            case "9":
                console.log(new Messages().msg.operations.showPostsByHashtag)
                this.exibirPostagensPorHashtag()
                break
            case "10":
                console.log(new Messages().msg.operations.showProfileRepository)
                this.viewProfiles()
                break
            case "11":
                console.log(new Messages().msg.operations.showPostsRepository)
                this.viewPosts()
                break
            case "12":
                console.log(new Messages().msg.operations.queryMostPopularPosts)
                const popularPosts: Postagem[] = this.getMostPopularPosts()
                console.log(popularPosts);
                (<RedeSocial> this.redeSocial).decrementarViewsAposExibir(popularPosts)
                this.hitEnter()
                break
            case "13":
                console.log(new Messages().msg.operations.queryMostPopularHashtags)
                const mostPopularPosts: Postagem[][] = this.getMostPopularHashtags()
                mostPopularPosts.forEach((i:Postagem[], pos) => {
                    (<RepositorioDePostagens> this.redeSocial.repPosts).showSpecificPosts(mostPopularPosts[pos]);
                    (<RedeSocial> this.redeSocial).decrementarViewsAposExibir(mostPopularPosts[pos])
                })
                this.hitEnter()
                break
            case "14":
                console.log(new Messages().msg.operations.postHashtagAppend)
                this.addHashtag()
                break
            default:
                console.log(new Messages().msg.fail.invalidOptionsMainSwitch)
        }
    }

    // Case 1
    incluirPerfil(): void {
        // Inputs 
        const inputName: string = this.requestInput(new Messages().msg.inputs.askPersonName)
        const inputEmail: string = this.requestInput(new Messages().msg.inputs.askPersonEmail)
        const newProfile: Perfil = new Perfil(this.redeSocial.repPerfis.lastId, inputName, inputEmail)
        
        // Inputs analysis
        const analysis: number = (<RedeSocial> this.redeSocial).incluirPerfil(newProfile)
        
        // If this is 0, the profile has already been included
        if (analysis === 0) {
            (<RepositorioDePerfis> this.redeSocial.repPerfis).updateId()
            console.log(new Messages().msg.warn)
            console.log(new Messages().msg.success.profileCreated)
            this.hitEnter()
            return 
        }
        console.log(new Messages().msg.warn)
        console.log(new Messages().msg.fail.profileNotCreated)
    }
    
    // Case 2
    consultarPerfil(): void {
        const profileId: number = this.requestNumberInput(new Messages().msg.inputs.askProfileId)
        const query = (<RedeSocial> this.redeSocial).consultarPerfil(profileId, this.mockProfile.nome, this.mockProfile.email)
        console.log(query ? `{ id: ${query.id} nome: ${query.nome} email: ${query.email} }` : "{ }")
        this.hitEnter()
    }
    
    // Case 3: The including action is inside the "analysis" variable 
    incluirPostagem(): void {
        let postType: string
        let today: string
        
        do {
            postType = this.requestInput(new Messages().msg.inputs.askPostType)
        } while (postType !== "1" && postType !== "2")

        do {
            today = this.requestInput(new Messages().msg.inputs.askDateAsTutorial)
        } while(!(( <RedeSocial> this.redeSocial).handleDate(today, "-")))
        
        const text: string = this.requestInput(new Messages().msg.inputs.askPostContent)
        const profileId: number = this.requestNumberInput(new Messages().msg.inputs.askProfileId)
        const profileExists: Perfil = (<RepositorioDePerfis> this.redeSocial.repPerfis).consultar(profileId)
        
        if (profileExists) {
            // Regular post
            if (postType === "1") {
                const newPost: Postagem = new Postagem(this.redeSocial.repPosts.lastId, text, 0, 0, today, profileExists);
                const analysis: number = (<RedeSocial> this.redeSocial).incluirPostagem(newPost);
                if (analysis === 0) {
                    (<RepositorioDePostagens> this.redeSocial.repPosts).updateId()
                    console.log(new Messages().msg.warn)
                    console.log(new Messages().msg.success.postCreated)
                    this.hitEnter()
                    return
                }
            }
            // Advanced Post: both post types have a profile id linked to them, so the same "profileExists" is used
            else if (postType === "2") {
                const profileHashtags: string[] = []
                const views: number = this.requestNumberInput(new Messages().msg.inputs.askPostViewsRange)
                const hashTagsAmount: number = this.requestNumberInput(new Messages().msg.inputs.askHashtagsAmount)

                // Hashtags being added progressively on the loop (one input for each index)
                for (let i = 0; i < hashTagsAmount; i++) {
                    let hashtag: string = this.requestInput(`Nome da ${i + 1}a hashtag`)
                    profileHashtags.push("#" + hashtag)
                }

                // Creating post instance
                const newPost: PostagemAvancada = new PostagemAvancada(
                    this.redeSocial.repPosts.lastId, 
                    text, 0, 0, today, profileExists, profileHashtags, views
                );
                
                const analysis: number = (<RedeSocial> this.redeSocial).incluirPostagem(newPost); 
                if (analysis === 0) {
                    (<RepositorioDePostagens> this.redeSocial.repPosts).updateId()
                    console.log(new Messages().msg.warn)
                    console.log(new Messages().msg.success.postCreated)
                    this.hitEnter()
                    return
                }
            }
            
        }
        console.log(new Messages().msg.warn)
        console.log(new Messages().msg.fail.postNotCreated)
    }

    // Case 4
    consultarPostagem(): void {
        const postType: string = this.requestInput(new Messages().msg.inputs.askPostType)
        
        // Regular post: focus on parameter profile id
        if (postType === "1") {
            const profileId: number = this.requestNumberInput(new Messages().msg.inputs.askProfileId)
            const query: Postagem[] = (<RedeSocial> this.redeSocial).consultarPostagens(
                profileId, this.mockPost.texto, "void", this.mockProfile
            )
            query ? (<RepositorioDePostagens> this.redeSocial.repPosts).showSpecificPosts(query) : `{ }`
        }
        // Advanced post: focus on hashtag attribute
        else {
            const hashtag: string = this.requestInput(new Messages().msg.inputs.askHashtagContent)
            const query: Postagem[] = (<RedeSocial> this.redeSocial).consultarPostagens(
                this.mockProfile.id, this.mockPost.texto, hashtag, this.mockProfile
            )
            query ? (<RepositorioDePostagens> this.redeSocial.repPosts).showSpecificPosts(query) : `{ }`
        }
        this.hitEnter()
    }

    // Case 5
    curtir(): void {
        const postId: number = this.requestNumberInput(new Messages().msg.inputs.askPostId) 
        
        // This will return an array with only one index of the post instance expected
        const thePost: Postagem = (<RepositorioDePostagens> this.redeSocial.repPosts).consultarUnico(postId)

        if (thePost.id != -1) {
            console.log(thePost)
            
            thePost instanceof PostagemAvancada 
            ? (<RedeSocial> this.redeSocial).decrementarVisualizacoes(thePost)
            : null;

            (<RedeSocial> this.redeSocial).curtir(postId)

            console.log(new Messages().msg.warn)
            this.requestInput(new Messages().msg.success.postLiked, true)
            console.log(thePost)
        } else {
            console.log(new Messages().msg.warn)
            console.log(new Messages().msg.fail.postNotFound)
            console.log("{  }")
        }
        
        this.hitEnter()
    }

    // Case 6
    descurtir(): void {
        const postId: number = this.requestNumberInput(new Messages().msg.inputs.askPostId)  
        
        // This will return an array with only one index of the post instance expected
        const thePost: Postagem = (<RepositorioDePostagens> this.redeSocial.repPosts).consultarUnico(postId)

        if (thePost.id != -1) {
            console.log(thePost)
            
            thePost instanceof PostagemAvancada 
            ? (<RedeSocial> this.redeSocial).decrementarVisualizacoes(thePost)
            : null;

            (<RedeSocial> this.redeSocial).descurtir(postId)

            console.log(new Messages().msg.warn)
            this.requestInput(new Messages().msg.success.postDisliked, true)
            console.log(thePost)
        } else {
            console.log(new Messages().msg.warn)
            console.log(new Messages().msg.fail.postNotFound)
            console.log("{  }")
        }
        this.hitEnter()
    }

    // Case 7: Decrement views from all posts from a certain profile id or from a certain hashtag
    decrementarViews(): void {
        const searchType: string = this.requestInput(new Messages().msg.inputs.askSearchingMethod)
        let query: Postagem[]
        
        if (searchType === "1") {
            const profileId: number = this.requestNumberInput(new Messages().msg.inputs.askProfileId)
            query = this.redeSocial.consultarPostagens(
                profileId, this.mockPost.texto, "void", this.mockProfile
            )
        }
        else {
            const hashtag: string = this.requestInput(new Messages().msg.inputs.askHashtagContent)
            query = this.redeSocial.consultarPostagens(
                this.mockProfile.id, this.mockPost.texto, hashtag, this.mockProfile
            )
        }

        // Show all posts found within this profile's id range
        console.log(new Messages().msg.success.postsFound)
        query ? (<RepositorioDePostagens> this.redeSocial.repPosts).showSpecificPosts(query) : `{ }`;

        // Reduce views from the ones that are advanced posts after showing the results
        (<RedeSocial> this.redeSocial).decrementarViewsAposExibir(query)

        this.hitEnter()
    }

    /*
    ===== ISSUE =====
    There were changes at "exibirPostagensPorHashtag" from "RedeSocial" class
    There were changes at "exibirPostagensPorPerfil" from "RedeSocial" class
    Decrementing views at inside these functions (as asked) seems inaccurate 
    The functions previous behavior decreased views before their exhibition
    What is the matter? Let us suppose that one advanced post has been found and has 1 view left
    This leads to a behavior that even though it has 1 view left, it'll turn into 0 before being shown
    Conclusion? It won't be shown
    Solution? shift the reducing behavior from the main function to their cases (8 and 9)
    */

    // Case 8
    exibirPostagensPorPerfil(): void {
        const profileId: number = this.requestNumberInput(new Messages().msg.inputs.askProfileId)
        const postsFound: Postagem[] = (<RedeSocial> this.redeSocial).exibirPostagensPorPerfil(profileId)
        console.log(postsFound);
        
        // Decreasing views after results are displayed
        (<RedeSocial>this.redeSocial).decrementarViewsAposExibir(postsFound)
        this.hitEnter()
    }

    // Case 9
    exibirPostagensPorHashtag(): void {
        const hashtag: string = this.requestInput(new Messages().msg.inputs.askHashtagContent)
        const postsFound: Postagem[] = (<RedeSocial> this.redeSocial).exibirPostagensPorHashtag(hashtag)
        console.log(postsFound);
        
        // Decreasing views after results are displayed
        (<RedeSocial> this.redeSocial).decrementarViewsAposExibir(postsFound)
        this.hitEnter()
    }

    // Case 10
    viewProfiles(): void {
        console.log("Perfis registrados", this.redeSocial.repPerfis.getProfileRepositorySize())
        this.showProfileDatabase()
        this.hitEnter()
    }

    showProfileDatabase(): void {
        console.log("\n[")
        for(let i = 0; i < (<RepositorioDePerfis> this.redeSocial.repPerfis).getProfileRepositorySize(); i++) {
            const thisProfile = this.redeSocial.repPerfis.perfis[i]
            console.log(thisProfile)
        }
        console.log("]")
    }
    
    // Case 11
    viewPosts(): void {
        console.log("Postagens registradas", this.redeSocial.repPosts.getPostsRepositorySize())
        this.showPostsDatabase()
        this.hitEnter()
    }

    showPostsDatabase(): void {
        console.log("\n[")
        for(let i = 0; i < (<RepositorioDePostagens> this.redeSocial.repPosts).getPostsRepositorySize(); i++) {
            const thisPost: Postagem = this.redeSocial.repPosts.postagens[i] 
            console.log(thisPost)
        }
        console.log("]")
    }

    // Case 12
    getMostPopularPosts(): Postagem[] {
        const rankAmount: number = this.requestNumberInput(new Messages().msg.inputs.askPostAmountForRank)
        
        let advancedPosts: Postagem[] = this.redeSocial.repPosts.postagens.filter((i: Postagem) => {
            if (i instanceof PostagemAvancada) {
                return true
            }
            return false
        })
        
        advancedPosts.sort((a: Postagem, b: Postagem) => {
            if (a instanceof PostagemAvancada && b instanceof PostagemAvancada) {
                return b.visualizacoesRestantes - a.visualizacoesRestantes
            }
            return 0
        })
        
        // There is a slice function who does this loop's work, but I chose not to do it
        let popularPosts: Postagem[] = []
        for (let i = 0; i < rankAmount; i++) {
            popularPosts.push(advancedPosts[i])
        }

        return popularPosts
    }

    // Case 13
    getMostPopularHashtags(): PostagemAvancada[][] {
        const rankAmount: number = this.requestNumberInput(new Messages().msg.inputs.askHashtagAmountForRank)
        const hashtagsBoxNonUnique: string[] = (<RepositorioDePostagens> this.redeSocial.repPosts).getAdvancedPostsHashtags((<RepositorioDePostagens>this.redeSocial.repPosts).getAdvancedPosts())
        const hashtagsBox: Hashtag = new Hashtag(hashtagsBoxNonUnique)
        const hashtagsBoxUnique: string[] = (<Hashtag> hashtagsBox).filterUniqueHashtags()
        const hashtagsCountageRank: [string, number][] = (<Hashtag> hashtagsBox).sortAscendingOrder()
        const rank: [string, number][] = []

        const overallPopularHashtagPosts: PostagemAvancada[][] = []
        // Put into "rank" the results based on the range the user provided
        // rank = [["#saúde", 4], ["#animais", 3], ["#mundo", 2]]
        for (let i = 0; i < rankAmount; i++) {
            rank.push(hashtagsCountageRank[i])
        }
        for (let i = 0; i < rank.length; i++) {
            const hashtag: string = rank[i][0]
            // overallPopularHashtagPosts.push()
            overallPopularHashtagPosts.push(this.redeSocial.exibirPostagensPorHashtag(hashtag))
        }
        return overallPopularHashtagPosts
    }

    addHashtag(): void {
        const profileId: number = this.requestNumberInput(new Messages().msg.inputs.askProfileId)
        const postsFromThisProfile: Postagem[] = this.redeSocial.repPosts.consultar(profileId, this.mockAdvancedPost.hashtags[0])
        
        const idList: number[] = []
        postsFromThisProfile.forEach((i: Postagem) => {i instanceof PostagemAvancada ? idList.push(i.id) : null})
        
        console.log(postsFromThisProfile)
        console.log(new Messages().msg.tutorial.askWhichId, "\n", idList)
        const advancedPostId: number = this.requestNumberInput(new Messages().msg.inputs.choosePostId)
        
        idList.forEach((i: number) => {
            if (advancedPostId === i) {
                const newHashtag: string = this.requestInput(new Messages().msg.inputs.askHashtagContent)
                const newPost = this.redeSocial.repPosts.postagens[i]
                if (newPost instanceof PostagemAvancada) {
                    (<PostagemAvancada> newPost).adicionarHashtag(newHashtag)
                }
                console.log(new Messages().msg.warn)
                console.log(new Messages().msg.success.hashtagAdded)
                console.log(newPost)
            }
        })
        this.hitEnter()
    }
}

export class Hashtag {
    private _hashBox: string[]
    private _uniqueHashBox: string[]
    private _countageReport: [string, number][] = []
    
    constructor(hashBox: string[]) {
        this._hashBox = hashBox
        this._uniqueHashBox = []
        this._countageReport = []
    }

    get hashBox(): string[] {
        return this._hashBox
    }

    set hashBox(newValue) {
        this._hashBox = newValue
    }

    get uniqueHashBox(): string[] {
        return this._uniqueHashBox
    }

    set uniqueHashBox(newValue) {
        this._uniqueHashBox = newValue
    }

    get countageReport(): [string, number][] {
        return this._countageReport
    }

    filterUniqueHashtags(): string[] {
        this.uniqueHashBox = this.hashBox.filter((i: string, pos: number, array: string[]) => {
            if (array.indexOf(i) === pos) {
                return true
            }
        })
        return this.uniqueHashBox
    }

    countEachHashtag(): [string, number][] {
        const report: [string, number][] = [];
      
        this.uniqueHashBox.forEach((i, pos) => {
            report[pos] = [i, 0]
        })
    
        this.hashBox.forEach((i) => {
            if (this.uniqueHashBox.includes(i)) {
                report[this.uniqueHashBox.indexOf(i)][1]++
            }
        })
        
        return report
    }
    
    sortAscendingOrder(): [string, number][] {
        const hashtagsSortedAscending: [string, number][] = this.countEachHashtag().sort((i: [string, number], i2: [string, number]) => {
            if (i2[1] < i[1]) {
                return -1  
            } else if (i2[1] > i[1]) {
                return 1  
            } else {
                return 0   
            }
        })
        return hashtagsSortedAscending
    }
}

export class Messages {
    msg

    constructor() {
        this.msg = {
            warn: "\n===== AVISO =====",
            operations: {
                includeProfile: "===== OPERAÇÃO 1: INCLUSÃO DE PERFIL =====",
                searchProfile: "===== OPERAÇÃO 2: PROCURAR PERFIL =====",
                includePost: "===== OPERAÇÃO 3: INCLUSÃO DE POSTAGEM =====",
                queryPost: "===== OPERAÇÃO 4: CONSULTA DE POSTAGEM =====",
                likePost: "===== OPERAÇÃO 5: CURTIR POSTAGEM =====",
                unlikePost: "===== OPERAÇÃO 6: DESCURTIR POSTAGEM =====",
                lessView: "===== OPERAÇÃO 7: DECREMENTAR VIEWS =====",
                showPostsByProfile: "===== OPERAÇÃO 8: EXIBIR POSTAGENS POR PERFIL =====",
                showPostsByHashtag: "===== OPERAÇÃO 9: EXIBIR POSTAGENS POR HASHTAG =====",
                showProfileRepository: "===== OPERAÇÃO 10: VER BANCO DE PERFIS =====",
                showPostsRepository: "===== OPERAÇÃO 11: VER BANCO DE POSTAGENS =====",
                queryMostPopularPosts: "===== OPERAÇÃO 12: CONSULTAR POSTS MAIS POPULARES ======",
                queryMostPopularHashtags: "===== OPERAÇÃO 13: CONSULTAR HASHTAGS MAIS POPULARES =====",
                postHashtagAppend: "===== OPERAÇÃO 14: ADIÇÃO DE HASHTAG EM POSTAGEM EXISTENTE ====="
            },
            success: {
                appClosed: "Aplicação encerrada!\n",
                postsFound: "===== POSTAGENS ENCONTRADAS =====",
                hashtagAdded: "Hashtag adicionada!\n",
                postLiked: "Postagem curtida! aperte ENTER e verifique.\n",
                postDisliked: "Postagem descurtida! aperte ENTER e verifique.\n",
                profileCreated: "Perfil criado!\n",
                postCreated: "Postagem criada!\n"
            },
            fail: {
                invalidOptionsMainSwitch: "Opções permitidas: 1 a 11!\n",
                invalidOptionSwitchPostInclusion: "Opções válidas: 1 ou 2\n",
                hashtagExists: "Hashtag repetida detectada!\n",
                postNotCreated: "Postagem não criada!\n",
                postNotFound: "Postagem não encontrada!\n",
                profileNotCreated: "Perfil não criado!\n"
            },
            inputs: {
                pressEnter: "\n>>> Pressione ENTER <<<",
                askOperationValue: "Digite o valor da operação",
                askPersonName: "Nome da pessoa:",
                askPersonEmail: "Email da pessoa:",
                askProfileId: "Informe o id do perfil",
                askPostType: "Informe o tipo de postagem:\n1. regular\n2. avançada",
                askPostContent: "Texto da postagem",
                askDateAsTutorial: "Informe ano, mês e o dia da postagem (ex: 2023-02-20)",
                askPostViewsRange: "Defina uma qtd. limite de views p/ a postagem",
                askHashtagsAmount: "Informe a qtd. de hashtags",
                askHashtagContent: "Informe a hashtag dessa postagem",
                askPostId: "Informe o id da postagem dessa postagem",
                askSearchingMethod: "Informe sua forma de procura:\n1. id de perfil\n2. hashtag",
                askPostAmountForRank: "Informe a qtd. de posts para fazer o rank",
                askHashtagAmountForRank: "Informe a qtd. de hashtags para fazer o rank",
                choosePostId: "Escolha e informe o id da postagem a receber nova hashtag",
            },
            tutorial: {
                askWhichId: "\nEscolha entre os id aquele que deseja add uma hashtag: "
            }
        }
    }
}
