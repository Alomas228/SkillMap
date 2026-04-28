using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using SkillMap.Data;
using SkillMap.Services;

var builder = WebApplication.CreateBuilder(args);

// База данных
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// API controllers
builder.Services.AddControllers();

// CORS для frontend dev-server, если запускаешь webpack dev server отдельно
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendDev", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "https://localhost:3000",
                "http://localhost:5173",
                "https://localhost:5173",
                "http://localhost:8080",
                "https://localhost:8080"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Cookie authentication
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        // Для SPA лучше не редиректить на /Account/Login
        options.LoginPath = "/";
        options.LogoutPath = "/";
        options.AccessDeniedPath = "/";

        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;

        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        options.SlidingExpiration = true;

        // Для API возвращаем 401, а не HTML redirect
        options.Events.OnRedirectToLogin = context =>
        {
            if (context.Request.Path.StartsWithSegments("/api"))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return Task.CompletedTask;
            }

            context.Response.Redirect("/");
            return Task.CompletedTask;
        };

        // Для API возвращаем 403, а не HTML redirect
        options.Events.OnRedirectToAccessDenied = context =>
        {
            if (context.Request.Path.StartsWithSegments("/api"))
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return Task.CompletedTask;
            }

            context.Response.Redirect("/");
            return Task.CompletedTask;
        };
    });

builder.Services.AddAuthorization();

// Password hasher
builder.Services.AddScoped<IPasswordHasher, BCryptPasswordHasher>();

var app = builder.Build();

// Миграции БД при старте
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/error");
    app.UseHsts();
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseCors("FrontendDev");

app.UseAuthentication();
app.UseAuthorization();

// Только API endpoints: /api/...
app.MapControllers();

// Все frontend routes отдаём в SPA.
// /
// /login
// /dashboard
// /profile
// /matrix
// всё откроет wwwroot/index.html
app.MapFallbackToFile("index.html");

app.Run();