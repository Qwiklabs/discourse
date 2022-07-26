# frozen_string_literal: true

module Jobs
  class PublishGroupMembershipUpdates < ::Jobs::Base
    def execute(args)
      raise Discourse::InvalidParameters.new(:type) if !%w[add remove].include?(args[:type])

      group = Group.find_by(id: args[:group_id])
      return if !group

      users = User.human_users.where(id: args[:user_ids])

      added_members = args[:type] == 'add'
      event_name = added_members ? :user_added_to_group : :user_removed_from_group

      users.each do |user|
        params = [user, group]
        params << { automatic: group.automatic? } if added_members

        DiscourseEvent.trigger(event_name, *params)
      end
    end
  end
end
