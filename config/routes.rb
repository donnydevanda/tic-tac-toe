Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: "board#index"
  post '/save_user_name', to: 'board#save_user_name'
  mount ActionCable.server => "/cable"
end
