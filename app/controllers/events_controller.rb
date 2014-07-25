class EventsController < WebsocketRails::BaseController
	def send_comment
		WebsocketRails[:comments].trigger :send_comment, message
		head :ok
	end

end