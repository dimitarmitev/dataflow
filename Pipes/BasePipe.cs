using DataflowApp.Hubs;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks.Dataflow;

namespace DataflowApp.Pipes
{
    public class BasePipe
    {
        IHubClients ClientProxy{ get; set; }
        protected ITargetBlock<Shape> EntryPoint{ get; set; }

        public BasePipe(IServiceProvider sp)
        {
            EntryPoint = new ActionBlock<Shape>((s) => { });
            ClientProxy = sp.GetService<IHubContext<DataflowHub>>()!.Clients;
        }

        public async Task SendShape(Shape shape)
        {
            await ClientProxy
                .Client(shape.ConnectionId)
                .SendAsync(
                    "ReceiveShape", 
                    shape
                );
        }

        public async Task SendShapes(
            Shape[] shapes)
        {
            foreach (var shape in shapes)
            {
                await SendShape(shape);
            }
        }

        public void ReceiveShape(Shape shape)
        {
            EntryPoint.Post(shape);
        }
    }
}
