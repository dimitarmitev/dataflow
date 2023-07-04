using DataflowApp.Pipes;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks.Dataflow;

namespace DataflowApp.Hubs
{
    public class DataflowHub : Hub
    {
        IServiceProvider ServiceProvider { get; set; }

        public DataflowHub(IServiceProvider sp)
        {
            ServiceProvider = sp;
        }

        public async Task StraightPipe(Shape shape)
        {
            shape.ConnectionId = Context.ConnectionId;
            ServiceProvider.GetService<StraightPipe>().ReceiveShape(shape);
        }

        public async Task StraightPipeParallel(Shape shape)
        {
            shape.ConnectionId = Context.ConnectionId;
            ServiceProvider.GetService<StraightPipeParallel>().ReceiveShape(shape);
        }
        public async Task TransformPipe(Shape shape)
        {
            shape.ConnectionId = Context.ConnectionId;
            ServiceProvider.GetService<TransformPipe>().ReceiveShape(shape);
        }

        public async Task BatchPipe(Shape shape)
        {
            shape.ConnectionId = Context.ConnectionId;
            ServiceProvider.GetService<BatchPipe>().ReceiveShape(shape);
        }

        public async Task BatchPipeWithTrigger(Shape shape)
        {
            shape.ConnectionId = Context.ConnectionId;
            ServiceProvider.GetService<BatchPipeWithTrigger>().ReceiveShape(shape);
        }

        public async Task TriggerBatch()
        {
            ServiceProvider.GetService<BatchPipeWithTrigger>().TriggerBatch();
        }
    }
}
