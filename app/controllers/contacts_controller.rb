class ContactsController < ApplicationController

  # GET /contact-us
  def new
    @contact = Contact.new
  end

  # POST /contact-us
  def create
    @contact = Contact.new(contact_params)
    if @contact.save
      # Send email
      name = params[:contact][:name]
      email = params[:contact][:email]
      body = params[:contact][:comments]
      ContactMailer.contact_email(name, email, body).deliver

      # Redirect with flash
      flash[:success] = "Message sent."
      redirect_to new_contact_path
    else
      # Redirect with flash containing errors
      flash[:danger] = @contact.errors.full_messages.join(", ")
      redirect_to new_contact_path
    end
  end

  private
    def contact_params
      params.require(:contact).permit(:name, :email, :comments)
    end
end