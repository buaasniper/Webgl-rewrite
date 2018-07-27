"set nocompatible
"filetype off

set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()

Plugin 'VundleVim/Vundle.vim'
Plugin 'Valloric/YouCompleteMe'
Plugin 'scrooloose/nerdtree'
Plugin 'scrooloose/syntastic'
Plugin 'tmhedberg/SimpylFold'
Plugin 'Konfekt/FastFold'
call vundle#end()            " required
filetype plugin indent on    " required

:syntax on
set si
set sw=2
set tabstop=2
set et
set sts=2
"autocmd Syntax c,cpp,vim,xml,html,xhtml setlocal foldmethod=syntax
"autocmd Syntax py setlocal 
set foldmethod=indent
vnoremap <space> zf
let g:SimpylFold_docstring_preview = 1
let g:SimpylFold_fold_docstring = 1

"set foldcolumn=5
set guifont=Inconsolata\ 12
set hlsearch
set number
set makeprg=g++\ %
colorschem desert
inoremap " ""<ESC>i
inoremap ' ''<ESC>i
inoremap ( ()<ESC>i
inoremap [ []<ESC>i
inoremap { {}<ESC>i
filetype indent on
" Uncomment the following to have Vim jump to the last position when                                                     
" reopening a file
if has("autocmd")
  au BufReadPost * if line("'\"") > 0 && line("'\"") <= line("$")
        \| exe "normal! g'\"" | endif
endif

" autocomplete
filetype plugin on
au FileType php setl ofu=phpcomplete#CompletePHP
au FileType ruby,eruby setl ofu=rubycomplete#Complete
au FileType html,xhtml setl ofu=htmlcomplete#CompleteTags
au FileType c setl ofu=ccomplete#CompleteCpp
au FileType css setl ofu=csscomplete#CompleteCSS

"this part used for syntastic
set statusline+=%#warningmsg#
set statusline+=%{SyntasticStatuslineFlag()}
set statusline+=%*

let g:syntastic_always_populate_loc_list = 1
let g:syntastic_auto_loc_list = 1
let g:syntastic_check_on_open = 1
let g:syntastic_check_on_wq = 0


