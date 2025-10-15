using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;



namespace ConsoleApp1
{
    public class ServerConnection
    {
        HttpClient client = new HttpClient();
        private readonly User _currentUser;
        private readonly string _authToken;
        string baseUrl = "";

        public List<Book> books = new List<Book>();
        public List<User> users = new List<User>();
        
        public ServerConnection(string url)
        {
            if (!url.StartsWith("http://"))
            {
                throw new Exception("Hibás URL, http://-el kell kezdődnie!");
            }
            baseUrl = url;
        }

        public async Task<List<Book>> GetBooks()
        {
            List<Book> result = new List<Book>();
            string url = baseUrl + "/book";
            try
            {
                HttpResponseMessage response = await client.GetAsync(url);
                response.EnsureSuccessStatusCode();
                result = JsonSerializer.Deserialize<List<Book>>(await response.Content.ReadAsStringAsync());
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
            return result;
        }

        public async Task<Message> PostBook(string title, string author, int publication, int page, string genre)
        {
            Message message = new Message();
            string url = baseUrl + "/book";
            try
            {
                var jsonData = new
                {
                    title = title,
                    author = author,
                    publicationYear = publication,
                    pages = page,
                    genre = genre
                };
                string jsonString = JsonSerializer.Serialize(jsonData);
                HttpContent content = new StringContent(jsonString, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync(url, content);
                response.EnsureSuccessStatusCode();
                message = JsonSerializer.Deserialize<Message>(await response.Content.ReadAsStringAsync());
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
            return message;
        }

        public async Task<Message> PutBook(int id, string title, string author, int publication, int page, string genre)
        {
            Message message = new Message();
            string url = baseUrl + "/book/" + id;
            dynamic jsonData = null;
            try
            {
                if (title != null)
                {
                    jsonData = new
                    {
                        title = title
                    };
                }
                if (author != null)
                {
                    jsonData = new
                    {
                        author = author
                    };
                }
                if (publication != null)
                {
                    jsonData = new
                    {
                        publicationYear = publication
                    };
                }
                if (page != null)
                {
                    jsonData = new
                    {
                        pages = page
                    };
                }
                if (genre != null)
                {
                    jsonData = new
                    {
                        genre = genre
                    };
                }
                string jsonString = JsonSerializer.Serialize(jsonData);
                HttpContent content = new StringContent(jsonString);
                HttpResponseMessage response = await client.PostAsync(url, content);
                response.EnsureSuccessStatusCode();
                message = JsonSerializer.Deserialize<Message>(await response.Content.ReadAsStringAsync());
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
            return message;
        }

        public async Task<Message> DeleteItem<T>(int id)
        {
            string url = "";
            Type type = typeof(T);
            Message message = new Message();
            if (type == typeof(Book))
            {
                url = baseUrl + "/book/" + id;
            }
            else if (type == typeof(User))
            {
                url = baseUrl + "/user/" + id;
            }

            try
            {
                HttpResponseMessage response = await client.DeleteAsync(url);
                response.EnsureSuccessStatusCode();
                message = JsonSerializer.Deserialize<Message>(await response.Content.ReadAsStringAsync());
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
            return message;
        }

        
    }
}
