namespace ConsoleApp1
{
    internal class Program
    {
        static ServerConnection server = new ServerConnection("http://localhost:3000");
        static void Main(string[] args)
        {
            while (true)
            {
                MenuHandler();
            }
        }

        static void MenuHandler()
        {
            PrintMenu();
            int num = ValidateNumber(1, 4);
            SwitchMenu(num);
            Console.ReadKey();
        }

        static void PrintMenu()
        {
            Console.Clear();
            Console.WriteLine("[1] - Adatok listázása\n");
            Console.WriteLine("[2] - Adat létrehozása\n");
            Console.WriteLine("[3] - Adat törlése\n");
            Console.WriteLine("[4] - Kilépés\n");
        }

        static int ValidateNumber(int min = int.MinValue, int max = int.MaxValue)
        {
            Console.WriteLine("Kérem adjon meg egy számot: ");
            string line = Console.ReadLine().Trim(' ', ',', '.');
            int result = 0;
            if (int.TryParse(line, out result))
            {
                if (result <= max && result >= min)
                {
                    return result;
                }
                else
                {
                    Console.WriteLine("A szám nem a megadott határértéken belül van!");
                }
            }
            else
            {
                Console.WriteLine("Nem szám lett megadva!");
            }
            result = ValidateNumber(min, max);
            return result;
        }

        static void SwitchMenu(int num)
        {
            switch (num)
            {
                case 1:
                    Function1();
                    break;
                case 2:
                    Function2();
                    break;
                case 3:
                    Function3();
                    break;
                case 4:
                    Environment.Exit(0);
                    break;
                default:
                    Console.WriteLine("Nincs ilyen menüpont!");
                    break;
            }
        }

        static async Task LoadBooks()
        {
            server.books = await server.GetBooks();
        }

        static async void Function1()
        {
            Console.Clear();
            Console.WriteLine("[1] - Könyvek");
            int choice = ValidateNumber(0,1);
            switch (choice)
            {
                case 0:
                    MenuHandler();
                    break;
                case 1:
                    await LoadBooks();
                    Function1Write(server.books);
                    break;
            }
        }

        static void Function1Write<T>(List<T> list)
        {
            foreach(var item in list)
            {
                Console.WriteLine(item);
            }
        }

        static void Function2()
        {
            Console.Clear();
            Console.WriteLine("[1] - Könyvek");
            int choice = ValidateNumber(0, 1);
            switch (choice)
            {
                case 0:
                    MenuHandler();
                    break;
                case 1:
                    CreateBook();
                    break;
            }
        }

        static void CreateBook()
        {
            Console.Write("Cím: ");
            string title = Console.ReadLine();
            Console.Write("Szerző: ");
            string author = Console.ReadLine();
            Console.Write("Kiadás éve: ");
            int publication = ValidateNumber(0, DateTime.Now.Year);
            Console.Write("Oldalszám: ");
            int pages = ValidateNumber(1, 1000);
            Console.Write("Műfaj: ");
            string genre = Console.ReadLine();

            server.PostBook(title, author, publication, pages, genre);
        }

        static void Function3()
        {
            Console.Clear();
            Console.WriteLine("[1] - Könyvek");
            int choice = ValidateNumber(0, 1);
            switch (choice)
            {
                case 0:
                    MenuHandler();
                    break;
                case 1:
                    Delete(server.books);
                    break;
            }
        }

        static async Task Delete<T>(List<T> list)
        {
            Console.Clear();
            Function1Write(list);
            int id = ValidateNumber(0, 5000);
            if (id == 0)
            {
                MenuHandler();
            }
            await server.DeleteItem<T>(id);
        }
    }
}
