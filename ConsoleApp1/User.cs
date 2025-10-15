using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    public class User
    {
        public int id { get; set; }
        public string? username { get; set; }
        public string? password { get; set; }
        public int age { get; set; }
        public int weight { get; set; }

        public override string ToString()
        {
            return $"ID: {id} | felhasználónév: {username}, kor: {age}, súly: {weight}";
        }
    }
}
