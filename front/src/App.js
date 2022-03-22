import { gql, useQuery } from "@apollo/client";
import InfiniteScroll from 'react-infinite-scroll-component';
import './App.css';

function App() {
  const usersQuery = gql`
    query($offset: Int, $limit:Int) {
      users(offset :$offset, limit: $limit ) {
        edges {
          id
          name
          email
          username
        }
        pageInfo {
          hasNextPage
        }
      } 
    }
  `

  const { data, loading, fetchMore } = useQuery(usersQuery)

  return (
    <div className="App">
      <InfiniteScroll
        dataLength={data?.users?.edges?.length || 0}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        next={() => {
          fetchMore({ variables: { offset: data.users.edges.length } })
        }}
      >
        {data && data.users && data.users.edges.map(user => {
          return (
            <div className="card mb-3 ml-5 pl-5" key={user.id}>
              <div className="card-header">
                User
              </div>
              <div className="card-body">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">{user.email.toLowerCase()}</p>
              </div>
            </div>
          )
        })}
      </InfiniteScroll>
      {loading && 'LOADING... '}
    </div>
  );
}

export default App;
