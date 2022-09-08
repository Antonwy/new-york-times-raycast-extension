import { Action, ActionPanel, getPreferenceValues, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { NYResult, Post } from "./types";

const tagColors = ["#ee3835", "#a735ee", "#3588ee"];

export default function Command() {
  const apiKey = getPreferenceValues()?.api_key;

  const { isLoading, data, revalidate } = useFetch<NYResult>(
    `https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=${apiKey}`
  );

  console.log(data);

  return (
    <List
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action title="Reload" onAction={revalidate} />
        </ActionPanel>
      }
      isShowingDetail
    >
      {data?.results.map((post) => {
        return (
          <List.Item
            title={post.title}
            detail={
              <List.Item.Detail
                markdown={generateMarkdownFromPost(post)}
                metadata={
                  <List.Item.Detail.Metadata>
                    <List.Item.Detail.Metadata.Label title="Author" text={post.byline} />
                    <List.Item.Detail.Metadata.Label title="Published" text={post.published_date} />
                    <List.Item.Detail.Metadata.Label title="Section" text={post.section} />
                    {post.adx_keywords ? (
                      <List.Item.Detail.Metadata.TagList title="Keywords">
                        {post.adx_keywords
                          .split(";")
                          .slice(0, 3)
                          .map((keyword, i) => (
                            <List.Item.Detail.Metadata.TagList.Item text={keyword} color={tagColors[i]} />
                          ))}
                      </List.Item.Detail.Metadata.TagList>
                    ) : (
                      <></>
                    )}
                  </List.Item.Detail.Metadata>
                }
              />
            }
            actions={
              <ActionPanel>
                <Action.OpenInBrowser url={post.url} />
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}

const generateMarkdownFromPost = (post: Post): string => {
  const { title, abstract } = post;

  return `
  # ${title}\n
  ---
  ${abstract}\n
  `;
};
