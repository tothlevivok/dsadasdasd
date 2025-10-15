using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    public class Book
    {
        public int id { get; set; }
        public string? title { get; set; }
        public string? author { get; set; }
        public int publicationYear { get; set; }
        public int pages { get; set; }
        public string genre { get; set; }

        public override string ToString()
        {
            return $"ID: {id} | cím: {title}, szerző: {author}, kiadás éve: {publicationYear}, oldalszám: {pages}, műfaj: {genre}";
        }
    }
}
