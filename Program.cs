using DataflowApp.Hubs;
using DataflowApp.Pipes;

namespace DataflowApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddRazorPages();
            builder.Services.AddSignalR();
            builder.Services.AddSingleton<StraightPipe>();
            builder.Services.AddSingleton<StraightPipeParallel>();
            builder.Services.AddSingleton<TransformPipe>();
            builder.Services.AddSingleton<BatchPipe>();
            builder.Services.AddSingleton<BatchPipeWithTrigger>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.MapRazorPages();
            app.MapHub<DataflowHub>("/dataflowHub");

            app.Run();
        }
    }
}