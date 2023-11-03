

import {Perfil, RepositorioDePerfis, Postagem, RepositorioDePostagens, RedeSocial} from "../cls/cls"

// Question 3: repository of profiles
export const profiles: Perfil[] = []
export const repProfiles: RepositorioDePerfis = new RepositorioDePerfis(profiles)

// Question 4: repository of posts
export const posts: Postagem[] = []
export const repPosts: RepositorioDePostagens = new RepositorioDePostagens(posts)

// Question 5: class that accesses the repository of profiles and posts
export const eclipse: RedeSocial = new RedeSocial(repProfiles, repPosts)
