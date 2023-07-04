using DataflowApp.Hubs;
using System.IO.Pipelines;
using System.Threading.Tasks.Dataflow;

namespace DataflowApp.Pipes
{
    public class StraightPipe : BasePipe
    {        
        public StraightPipe(IServiceProvider sp): 
            base(sp)
        {
            var actionBlock =
                new ActionBlock<Shape>(
                    async (shape) =>
                    {
                        await Task.Delay(1000);
                        await SendShape(shape);
                    }
                );
            EntryPoint = actionBlock;
        }
    }
}
