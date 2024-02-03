class BoardController < ApplicationController
  def index; end

  def save_user_name
    session[:user_name] = params[:user_name]
    render json: { success: true }
  end
end
