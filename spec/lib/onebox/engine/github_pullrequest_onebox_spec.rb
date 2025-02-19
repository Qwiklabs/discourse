# frozen_string_literal: true

RSpec.describe Onebox::Engine::GithubPullRequestOnebox do
  before do
    @link = "https://github.com/discourse/discourse/pull/1253/"
    @uri = "https://api.github.com/repos/discourse/discourse/pulls/1253"

    stub_request(:get, @uri).to_return(status: 200, body: onebox_response(described_class.onebox_name))
  end

  include_context "engines"
  it_behaves_like "an engine"

  describe "#to_html" do
    it "includes pull request author" do
      expect(html).to include("jamesaanderson")
    end

    it "includes repository name" do
      expect(html).to include("discourse")
    end

    it "includes commit author gravatar" do
      expect(html).to include("b3e9977094ce189bbb493cf7f9adea21")
    end

    it "includes commit time and date" do
      expect(html).to include("02:05AM - 26 Jul 13")
    end

    it "includes number of commits" do
      expect(html).to include("1")
    end

    it "includes number of files changed" do
      expect(html).to include("4")
    end

    it "includes number of additions" do
      expect(html).to include("19")
    end

    it "includes number of deletions" do
      expect(html).to include("1")
    end

    it "includes the body without comments" do
      expect(html).to include("http://meta.discourse.org/t/audio-html5-tag/8168")
      expect(html).not_to include("test comment")
    end
  end
end
